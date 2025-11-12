// src/pages/DetailPage/DetailPage.tsx

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';
import { BANK_NAME_BY_CODE } from '@/constants/banks';
import {
  refreshTripPlanBalanceWithRetry,
  BankOrganizationCode,
  refreshTripPlanBalance,
} from '@/api/bank/bank';
import {
  useTripPlanDetail,
  useTripPlanBalances,
  useDeleteTripPlan,
  TRIP_KEYS,
} from '@/api/trips/queries';
import type { TripDetailModel } from '@/api/trips/types';
import { useMe } from '@/api/users/queries';
import ExchangeRateCard from './sections/ExchangeRateCard/ExchangeRateCard';

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

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const location = useLocation() as { state?: { thumbnailUrl?: string } };
  const thumbFromList = location.state?.thumbnailUrl;

  // 상세 / 밸런스 / 유저
  const { data, isLoading, isError } = useTripPlanDetail(tripId); // TripDetailModel
  const { data: balances = [] } = useTripPlanBalances(tripId);
  const { data: me } = useMe();
  const meId = me?.id;

  const { mutate: deletePlan, isPending: deleting } = useDeleteTripPlan();

  const [openMenu, setOpenMenu] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | undefined>(undefined);
  const [accountBalance, setAccountBalance] = useState<number | undefined>(undefined);
  const tipForProgress = isAccountLinked ? data?.overviewTip : undefined;
  // ---------- 내 진행률: balances 1순위, 상세 폴백 ----------
  const myProgressFromBalances = useMemo(() => {
    if (!meId) return undefined;
    const meRow = (balances as any[]).find((b) => b.userId === meId);
    return typeof meRow?.progress === 'number' ? meRow.progress : undefined;
  }, [balances, meId]);

  const myProgressFallback = useMemo(() => {
    // TripDetailModel 에는 totalBudget / currentSavings 가 있음
    const totalBudget = (data as TripDetailModel | undefined)?.totalBudget ?? 0;
    const currentSavings = (data as TripDetailModel | undefined)?.currentSavings ?? 0;
    if (totalBudget > 0) return (currentSavings / totalBudget) * 100;
    return 0;
  }, [data]);

  // 화면 표시용 진행률(단일 소스)
  const [progress, setProgress] = useState<number>(0);

  // 서버 데이터 변화 시 동기화
  useEffect(() => {
    const next =
      typeof myProgressFromBalances === 'number' ? myProgressFromBalances : myProgressFallback;
    const rounded = Math.round(next * 10) / 10;
    setProgress(clampPercent(rounded));
  }, [myProgressFromBalances, myProgressFallback]);

  // ---------- 멤버 리스트 ----------
  const groupMembers = useMemo(() => {
    // balances가 최우선
    if (balances.length) {
      return (balances as any[]).map((b) => ({
        id: String(b.userId),
        name: b.nickname,
        avatarUrl: b.profileImage,
        percent: clampPercent(typeof b.progress === 'number' ? b.progress : 0),
      }));
    }
    // fallback: TripDetailModel 의 members 사용
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
    if (groupMembers.length) {
      const avg =
        groupMembers.reduce((acc: number, cur: any) => acc + (cur.percent ?? 0), 0) /
        groupMembers.length;
      return clampPercent(avg);
    }
    // 멤버가 전혀 없으면 내 진행률로 대체
    return progress;
  }, [groupMembers, progress]);

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
    if (!membersForOverview.length) return progress; // 멤버 없으면 내 진행률로 폴백
    const sum = membersForOverview.reduce((acc, m) => acc + (m.percent ?? 0), 0);
    return clampPercent(sum / membersForOverview.length);
  }, [membersForOverview, progress]);

  // ---------- TripOverviewCard용 개요 ----------
  // 기존 overview useMemo 수정
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
      // ✅ 여기 2줄 교체
      progressPercent: groupAvgForOverview,
      members: membersForOverview,

      tip: data.overviewTip,
      podiumImageUrl: podiumUrl,
      podiumTop3,
    };
  }, [data, thumbFromList, membersForOverview, groupAvgForOverview, podiumTop3]);

  const checklist = useMemo(() => data?.checklist ?? [], [data?.checklist]);
  const cautions = useMemo(() => data?.cautions ?? [], [data?.cautions]);
  // ---------- balances 재조회(새로고침/연동 시) ----------
  useEffect(() => {
    let mounted = true;
    if (!tripId) return;

    const planIdNum = Number(tripId);
    const wasLinked = getLinkedForPlan(planIdNum);

    if (!wasLinked) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      return;
    }

    (async () => {
      try {
        const bankOrg = getBankOrgForPlan(planIdNum) as BankOrganizationCode | undefined;

        const res = await refreshTripPlanBalanceWithRetry(planIdNum, {
          organizationCode: bankOrg,
        });

        if (!mounted) return;

        // 멤버별 잔액/진행도 쿼리 갱신
        qc.invalidateQueries({ queryKey: TRIP_KEYS.balances(planIdNum), exact: true });

        const bankName = bankOrg ? BANK_NAME_BY_CODE[bankOrg] : undefined;

        setIsAccountLinked(true);
        setAccountLabel(
          bankName ? `${bankName} ${res.accountNumberDisplay}` : res.accountNumberDisplay,
        );
        setAccountBalance(res.balance);
      } catch (err) {
        if (!mounted) return;
        // 재시도/폴백 실패 시 로컬 링크 해제
        setLinkedForPlan(planIdNum, false);
        setIsAccountLinked(false);
        setAccountLabel(undefined);
        setAccountBalance(undefined);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tripId, qc]);

  // ---------- 계좌 연동 완료 핸들러 ----------
  const handleBankConnected = async (bankCode: string, acct: string) => {
    const planId = Number(tripId);
    setLinkedForPlan(planId, true);
    setBankOrgForPlan(planId, bankCode);

    try {
      const res = await refreshTripPlanBalance(planId);
      qc.invalidateQueries({ queryKey: TRIP_KEYS.balances(planId), exact: true });
      const bankName = BANK_NAME_BY_CODE[bankCode] ?? '연동 계좌';
      setIsAccountLinked(true);
      setAccountLabel(`${bankName} ${res.accountNumberDisplay}`);
      setAccountBalance(res.balance);
    } catch {
      const bankName = BANK_NAME_BY_CODE[bankCode] ?? '연동 계좌';
      const maskAccount = (s: string) => s.replace(/\d(?=\d{4})/g, '*');
      setIsAccountLinked(true);
      setAccountLabel(`${bankName} ${maskAccount(acct)}`);
      setAccountBalance(undefined);
    } finally {
      setOpenBank(false);
    }
  };

  // ---------- 목표 달성(카테고리) 시 진행률 증분 반영 ----------
  const handleProgressDelta = (deltaPercent: number) => {
    setProgress((prev) => clampPercent(Math.round((prev + deltaPercent) * 10) / 10));
    if (id) {
      qc.invalidateQueries({ queryKey: TRIP_KEYS.balances(id), exact: true });
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
        <LeftIcon onClick={() => navigate(-1)} />
        <RightIcon onClick={() => setOpenMenu((s) => !s)} />
        {openMenu && (
          <Dropdown>
            <DropdownItem onClick={() => setOpenInvite(true)}>멤버 초대</DropdownItem>
            {/* <DropdownItem onClick={() => setOpenBank(true)}>계좌 연동</DropdownItem> */}
            <DropdownItem style={{ color: '#ff7b7b' }} onClick={handleDeletePlan}>
              플랜 삭제
            </DropdownItem>
          </Dropdown>
        )}
      </Container>

      {/* 진행 상황 */}
      <ProgressCard
        progress={progress}
        linked={isAccountLinked}
        accountLabel={accountLabel}
        balance={accountBalance}
        onClickLink={() => setOpenBank(true)}
        tip={tipForProgress}
      />

      {/* 예상 경비/목표 달성 */}
      <ExpenseCard tripId={id} savedPercent={progress} onProgressDelta={handleProgressDelta} />

      {/* 개요 카드 */}
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

      {/* 준비물/주의/팁 */}
      <BeforeYouGoCard
        destination={data.destination}
        checklist={checklist}
        cautions={cautions}
        tips={data.tips}
      />

      <ExchangeRateCard destination={data.destination} />
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
        />
      )}
    </div>
  );
}
