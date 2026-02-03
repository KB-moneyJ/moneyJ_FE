// src/pages/DetailPage/DetailPage.tsx

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  Container,
  LeftIcon,
  RightIcon,
  AirportWrapper,
  Dim,
  BottomCenterModal,
  ModalItem,
} from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';
import { BANK_NAME_BY_CODE } from '@/constants/banks';
import {
  useTripPlanDetail,
  useTripPlanBalances,
  useDeleteTripPlan,
  TRIP_KEYS,
} from '@/api/trips/queries';
import type { TripDetailModel } from '@/api/trips/types';
import { useMe } from '@/api/users/queries';
import ExchangeRateCard from './sections/ExchangeRateCard/ExchangeRateCard';
import { deleteAccount } from '@/api/accounts';
import styled from 'styled-components';
import Airport from '@/pages/StartPlan/airport/Airport';
import { getDestinationAirportCode } from '@/pages/StartPlan/airport/destinationAirportCode';

function clampPercent(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

// ---- 로컬 스토리지 유틸 ----
function getLinkedForPlan(planId: number): boolean {
  const raw = localStorage.getItem(`plan:${planId}:linked`);
  return raw === '1';
}
function setLinkedForPlan(planId: number, linked: boolean) {
  localStorage.setItem(`plan:${planId}:linked`, linked ? '1' : '0');
}
function getBankOrgForPlan(planId: number): string | undefined {
  return localStorage.getItem(`plan:${planId}:bankOrg`) || undefined;
}
function setBankOrgForPlan(planId: number, org: string) {
  localStorage.setItem(`plan:${planId}:bankOrg`, org);
}

function parsePeriod(period: string): { depart: string; returnDate: string } {
  const [start, end] = period.split(' - ');

  const toISO = (s: string) => s.replace(/\./g, '-'); // 2026.01.21 → 2026-01-21

  return {
    depart: toISO(start),
    returnDate: toISO(end),
  };
}

const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eee;
  margin-top: 6px;
`;
const TabItem = styled.div<{ $active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#ae65e1' : '#bababa')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #333' : '2px solid transparent')};
  transition: 0.2s ease;
`;

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const location = useLocation() as { state?: { thumbnailUrl?: string } };
  const thumbFromList = location.state?.thumbnailUrl;
  const [tab, setTab] = useState<'saving' | 'info'>('saving');

  // 상세 / 밸런스 / 유저
  const { data, isLoading, isError } = useTripPlanDetail(tripId); // TripDetailModel
  const { data: balancesData } = useTripPlanBalances(tripId);
  const balances = balancesData?.members ?? [];
  const serverGroupProgress = balancesData?.groupProgress;

  const { data: me } = useMe();
  const meId = me?.id;

  const { mutate: deletePlan, isPending: deleting } = useDeleteTripPlan();

  const [openMenu, setOpenMenu] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | undefined>(undefined);
  const [accountBalance, setAccountBalance] = useState<number | undefined>(undefined);
  const [accountId, setAccountId] = useState<number | undefined>(undefined);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const tipForProgress = isAccountLinked ? data?.overviewTip : undefined;

  const destinationAirportCode = useMemo(() => {
    return data?.destination ? getDestinationAirportCode(data.destination) : 'ICN';
  }, [data?.destination]);

  // ---------- 내 진행률: balances 1순위, 상세 폴백 ----------
  const myProgressFromBalances = useMemo(() => {
    const rows = balances as any[];
    if (!rows.length) return undefined;

    // 1순위: 내 ID로 매칭되는 멤버
    if (meId) {
      const meRow = rows.find((b) => String(b.id) === String(meId));
      if (meRow && typeof meRow.percent === 'number') {
        // 서버에서 0.0%로 왔을 때도 유효한 값으로 처리
        return meRow.percent;
      }
    }

    // 2순위: 매칭 실패 시 첫 번째 멤버 (잔액 표시 로직과 일치시킴)
    // 이렇게 해야 잔액은 나오는데 진행도는 0%인 불일치를 방지할 수 있음
    if (rows[0] && typeof rows[0].percent === 'number') {
      return rows[0].percent;
    }

    return undefined;
  }, [balances, meId]);

  const myProgressFallback = useMemo(() => {
    const totalBudget = (data as TripDetailModel | undefined)?.totalBudget ?? 0;
    const currentSavings = (data as TripDetailModel | undefined)?.currentSavings ?? 0;
    if (totalBudget > 0) return (currentSavings / totalBudget) * 100;
    return 0;
  }, [data]);

  // 화면 표시용 진행률(단일 소스)
  const [progress, setProgress] = useState<number>(0);

  const travelDates = useMemo(() => {
    if (!data?.period) return null;
    return parsePeriod(data.period);
  }, [data?.period]);

  // 서버 데이터 변화 시 동기화
  useEffect(() => {
    // myProgressFromBalances가 undefined가 아니면 사용 (0.0%도 유효한 값)
    // 단, NaN이나 Infinity 같은 잘못된 값은 폴백 사용
    let next: number;
    if (typeof myProgressFromBalances === 'number' && Number.isFinite(myProgressFromBalances)) {
      next = myProgressFromBalances;
    } else {
      next = myProgressFallback;
    }
    const rounded = Math.round(next * 10) / 10;
    setProgress(clampPercent(rounded));
  }, [myProgressFromBalances, myProgressFallback]);

  // ---------- balances에서 "나"의 계좌 정보 ----------
  const myBalanceRow = useMemo(() => {
    if (!meId) return undefined;
    // TripBalanceModel은 id(string) 필드를 사용
    return (balances as any[]).find((b) => String(b.id) === String(meId));
  }, [balances, meId]);

  // ---------- balances 기반으로 계좌 상태 세팅 ----------
  // balances API 응답(UserBalanceResponseDTO[])을 기반으로 계좌 연동 상태 자동 업데이트
  useEffect(() => {
    if (!tripId) return;

    const planIdNum = Number(tripId);
    const rows = (balances ?? []) as any[];

    // balances 자체가 없으면 = 계좌 미연동 처리
    if (!rows.length) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      setAccountId(undefined);
      setLinkedForPlan(planIdNum, false);
      return;
    }

    // 내 id 기준으로 행 찾기
    // adapter를 거친 후: TripBalanceModel { id: string, name, avatarUrl, balance, percent }
    // adapter 변환: id = String(userId)
    // meId가 유효한 값(양수)이고 매칭되는 항목이 있으면 사용, 없으면 첫 번째 항목 사용
    let target = undefined;
    if (meId != null && meId > 0) {
      target = rows.find((b) => String(b.id) === String(meId));
    }
    // meId로 찾지 못했거나 meId가 유효하지 않으면 첫 번째 항목 사용
    if (!target && rows.length > 0) {
      target = rows[0];
    }

    // 잔액 정보가 null이거나 undefined이면 = 미연동으로 본다
    // balance가 0인 경우는 유효한 값이므로 체크하지 않음
    if (!target || target.balance === null || target.balance === undefined) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      setAccountId(undefined);
      setLinkedForPlan(planIdNum, false);
      return;
    }

    // 여기까지 왔으면 계좌 연동된 상태로 간주
    setIsAccountLinked(true);
    setAccountBalance(Number(target.balance));
    // accountId는 balances에서 가져옴
    if (target.accountId) {
      setAccountId(target.accountId);
    }
    // accountLabel은 handleBankConnected에서 설정하거나, 없으면 기본값
    // useEffect에서는 balances 기반으로 isAccountLinked와 balance만 업데이트
    if (!accountLabel) {
      setAccountLabel('연동된 계좌');
    }
    setLinkedForPlan(planIdNum, true);
  }, [tripId, balances, meId, accountLabel]);

  // ---------- 멤버 리스트 ----------
  const groupMembers = useMemo(() => {
    if (balances.length) {
      // TripBalanceModel 필드: id, name, avatarUrl, balance, percent
      return (balances as any[]).map((b) => ({
        id: String(b.id),
        name: b.name,
        avatarUrl: b.avatarUrl,
        percent: clampPercent(typeof b.percent === 'number' ? b.percent : 0),
      }));
    }
    if (data?.members?.length) {
      return data.members.map((m) => ({
        id: m.id,
        name: m.name,
        avatarUrl: m.avatarUrl,
        percent: clampPercent(m.percent ?? 0),
      }));
    }
    return [];
  }, [balances, data?.members]);

  // ---------- 그룹 전체 진행도(멤버 평균) ----------
  const groupProgressPercent = useMemo(() => {
    // 서버에서 받은 그룹 진행도가 있으면 우선 사용
    if (typeof serverGroupProgress === 'number') {
      return clampPercent(serverGroupProgress);
    }

    if (groupMembers.length) {
      const avg =
        groupMembers.reduce((acc: number, cur: any) => acc + (cur.percent ?? 0), 0) /
        groupMembers.length;
      return clampPercent(avg);
    }
    return progress;
  }, [groupMembers, progress, serverGroupProgress]);

  // ---------- 포디움(상위 3명) ----------
  const podiumTop3 = useMemo(() => {
    if (groupMembers.length) {
      const sorted = [...groupMembers].sort((a, b) => b.percent - a.percent);
      return sorted.slice(0, 3);
    }
    if (me) {
      return [
        {
          id: String(me.id ?? 'me'),
          name: me.nickname ?? me.email ?? 'Me',
          percent: progress,
          avatarUrl: me.profileImage,
        },
      ];
    }
    return [];
  }, [groupMembers, me, progress]);

  const membersForOverview = useMemo(() => {
    const myIdStr = String(meId ?? '');
    if (!groupMembers.length) return [];
    return groupMembers.map((m) => (m.id === myIdStr ? { ...m, percent: progress } : m));
  }, [groupMembers, meId, progress]);

  const groupAvgForOverview = useMemo(() => {
    if (!membersForOverview.length) return progress;
    const sum = membersForOverview.reduce((acc, m) => acc + (m.percent ?? 0), 0);
    return clampPercent(sum / membersForOverview.length);
  }, [membersForOverview, progress]);

  // ---------- TripOverviewCard용 개요 ----------
  const overview = useMemo(() => {
    if (!data) return null;

    const destination = data.destination;
    const period = data.period;
    const thumbnailUrl = thumbFromList ?? data.thumbnailUrl;

    return {
      destination,
      countryCode: data.countryCode,
      period: period + (membersForOverview.length ? ` (${membersForOverview.length}명)` : ''),
      thumbnailUrl,
      progressPercent: groupAvgForOverview,
      members: membersForOverview,
      tip: data.overviewTip,
      podiumImageUrl: podiumUrl,
      podiumTop3,
    };
  }, [data, thumbFromList, membersForOverview, groupAvgForOverview, podiumTop3]);

  const checklist = useMemo(() => data?.checklist ?? [], [data?.checklist]);
  const cautions = useMemo(() => data?.cautions ?? [], [data?.cautions]);

  // ---------- 계좌 연동 완료 핸들러 ----------
  // 계좌 연동 후 /trip-plans/{tripPlanId}/balances API를 refetch하여 최신 데이터 가져오기
  // 이 API는 모든 멤버의 계좌와 달성율(UserBalanceResponseDTO)을 반환하므로 바로 활용
  const handleBankConnected = async (bankCode: string, acct: string) => {
    const wasLinked = isAccountLinked; // 변경 여부 판단

    const planId = String(tripId); // 문자열로 정규화 (queryKey 일관성)
    setLinkedForPlan(Number(tripId), true);
    setBankOrgForPlan(Number(tripId), bankCode);

    const bankName = BANK_NAME_BY_CODE[bankCode as keyof typeof BANK_NAME_BY_CODE] ?? '연동 계좌';
    const maskAccount = (s: string) => s.replace(/\d(?=\d{4})/g, '*');

    // 계좌 연동 상태 즉시 설정
    setIsAccountLinked(true);
    setAccountLabel(`${bankName} ${maskAccount(acct)}`);

    // 서버에서 잔액 업데이트 시간 확보를 위해 약간의 딜레이
    await new Promise((resolve) => setTimeout(resolve, 500));

    // refetchQueries로 강제 refetch (invalidate보다 확실하게 데이터 갱신)
    await qc.refetchQueries({
      queryKey: TRIP_KEYS.balances(planId),
      exact: true,
    });

    // detail 쿼리도 함께 refetch
    await qc.refetchQueries({
      queryKey: TRIP_KEYS.detail(planId),
      exact: true,
    });

    setOpenBank(false);

    if (wasLinked) {
      alert('계좌가 변경되었습니다.');
    }
  };

  // ---------- 계좌 연동 해제 ----------
  const handleUnlinkAccount = async () => {
    if (!accountId || isDeletingAccount) return;

    const ok = window.confirm('정말 계좌 연동을 해제할까요?');
    if (!ok) return;

    setIsDeletingAccount(true);
    try {
      await deleteAccount(accountId);

      // 계좌 연동 상태 초기화
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      setAccountId(undefined);
      setLinkedForPlan(Number(tripId), false);

      // 쿼리 refetch
      const planId = String(tripId);
      await qc.refetchQueries({
        queryKey: TRIP_KEYS.balances(planId),
        exact: true,
      });
      await qc.refetchQueries({
        queryKey: TRIP_KEYS.detail(planId),
        exact: true,
      });

      alert('계좌 연동이 해제되었습니다.');
    } catch (error) {
      console.error('계좌 삭제 실패:', error);
      alert('계좌 연동 해제에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // ---------- 플랜 삭제 ----------
  const handleDeletePlan = () => {
    if (!tripId || deleting) return;
    const ok = window.confirm(
      '정말 이 여행 플랜을 삭제할까요?\n삭제하면 모든 멤버의 리스트에서 제거됩니다.',
    );
    if (!ok) return;

    setOpenMenu(false);
    deletePlan(tripId, {
      onSuccess: (res) => {
        alert(res?.message ?? '여행 플랜이 삭제되었습니다.');
        navigate('/', { replace: true });
      },
      onError: (e) => {
        console.error(e);
        alert('플랜 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.');
      },
    });
  };

  if (isLoading) {
    return (
      <div>
        <Container>
          <LeftIcon onClick={() => navigate(-1)} />
        </Container>
        <div style={{ padding: '1rem', opacity: 0.8 }}>여행 플랜 불러오는 중…</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Container>
          <LeftIcon onClick={() => navigate(-1)} />
        </Container>
        <div style={{ padding: '1rem', color: '#ff8a8a' }}>
          여행 플랜을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Container>
        <LeftIcon onClick={() => navigate(-2)} />
        <RightIcon onClick={() => setOpenMenu((s) => !s)} />
        {openMenu && (
          <>
            <Dim onClick={() => setOpenMenu(false)} />
            <BottomCenterModal>
              <ModalItem onClick={() => setOpenInvite(true)}>멤버 초대</ModalItem>
              {/* <ModalItem onClick={() => setOpenBank(true)}>계좌 연동</ModalItem> */}
              <ModalItem danger onClick={handleDeletePlan}>
                플랜 삭제
              </ModalItem>
            </BottomCenterModal>
          </>
        )}
      </Container>

      <TabWrapper>
        <TabItem $active={tab === 'saving'} onClick={() => setTab('saving')}>
          저축 상세
        </TabItem>
        <TabItem $active={tab === 'info'} onClick={() => setTab('info')}>
          부가적 정보
        </TabItem>
      </TabWrapper>

      {tab === 'saving' && (
        <>
          <ProgressCard
            progress={progress}
            linked={isAccountLinked}
            accountLabel={accountLabel}
            balance={accountBalance}
            accountId={accountId}
            tripId={tripId}
            onClickLink={() => setOpenBank(true)}
            onClickUnlink={handleUnlinkAccount}
            onClickChangeAccount={() => setOpenBank(true)}
            tip={tipForProgress}
          />

          {/* 예상 경비/목표 달성 */}
          <ExpenseCard
            tripId={id}
            savedPercent={progress}
            accountBalance={accountBalance}
            totalBudget={data?.totalBudget}
            categories={data?.categories}
            onDataChange={async () => {
              // ExpenseCard에서 데이터 변경 시 쿼리 무효화하여 재조회
              // 문자열로 정규화하여 queryKey 일관성 유지
              const planId = String(id);
              await qc.refetchQueries({ queryKey: TRIP_KEYS.detail(planId), exact: true });
              await qc.refetchQueries({ queryKey: TRIP_KEYS.balances(planId), exact: true });
            }}
          />

          {overview && (
            <TripOverviewCard
              destination={overview.destination}
              countryCode={overview.countryCode}
              period={overview.period}
              thumbnailUrl={overview.thumbnailUrl}
              progressPercent={overview.progressPercent}
              members={overview.members}
              tip={overview.tip}
              podiumImageUrl={overview.podiumImageUrl}
              podiumTop3={overview.podiumTop3}
            />
          )}

          <BeforeYouGoCard
            destination={data.destination}
            checklist={checklist}
            cautions={cautions}
            tips={data.tips}
          />
        </>
      )}
      {tab === 'info' && (
        <>
          <>
            <ExchangeRateCard destination="Japan" />
            <AirportWrapper>
              {travelDates && (
                <Airport
                  destinationCode={destinationAirportCode}
                  depart={travelDates.depart}
                  returnDate={travelDates.returnDate}
                />
              )}
            </AirportWrapper>
          </>
        </>
      )}

      {openInvite && (
        <FriendInviteModal
          isOpen={openInvite}
          onClose={() => setOpenInvite(false)}
          planId={String(id)}
        />
      )}

      {openBank && (
        <BankConnectModal
          isOpen={openBank}
          onClose={() => setOpenBank(false)}
          onConnected={handleBankConnected}
          tripPlanId={id}
          isAlreadyLinked={isAccountLinked}
        />
      )}
    </div>
  );
}
