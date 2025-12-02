// src/pages/DetailPage/DetailPage.tsx

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import ExchangeRateCard from './sections/ExchangeRateCard/ExchangeRateCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';
import { BANK_NAME_BY_CODE } from '@/constants/banks';

import { getDestinationAirportCode } from "@/pages/StartPlan/airport/destinationAirportCode";

import {
  useTripPlanDetail,
  useTripPlanBalances,
  useDeleteTripPlan,
  TRIP_KEYS,
} from '@/api/trips/queries';
import type { TripDetailModel } from '@/api/trips/types';
import { useMe } from '@/api/users/queries';

import Airport from '@/pages/StartPlan/airport/Airport';

import styled from "styled-components";

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
    color: ${({ $active }) => ($active ? "#ae65e1" : "#bababa")};
    border-bottom: ${({ $active }) => ($active ? "2px solid #333" : "2px solid transparent")};
    transition: 0.2s ease;
`;

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const location = useLocation() as { state?: { thumbnailUrl?: string } };
  const thumbFromList = location.state?.thumbnailUrl;

  const [tab, setTab] = useState<"saving" | "info">("saving");

  const { data, isLoading, isError } = useTripPlanDetail(tripId);
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

  // ⭐ 여기에 destination → IATA 코드 변환 넣기
  const destinationAirportCode = useMemo(() => {
    return data?.destination
      ? getDestinationAirportCode(data.destination)
      : "ICN";
  }, [data?.destination]);

  // ---------------- 진행률 ----------------
  const myProgressFromBalances = useMemo(() => {
    if (!meId) return undefined;
    const meRow = (balances as any[]).find((b) => String(b.id) === String(meId));
    return typeof meRow?.percent === 'number' ? meRow.percent : undefined;
  }, [balances, meId]);

  const myProgressFallback = useMemo(() => {
    const totalBudget = (data as TripDetailModel | undefined)?.totalBudget ?? 0;
    const currentSavings = (data as TripDetailModel | undefined)?.currentSavings ?? 0;
    if (totalBudget > 0) return (currentSavings / totalBudget) * 100;
    return 0;
  }, [data]);

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const next =
      typeof myProgressFromBalances === 'number' ? myProgressFromBalances : myProgressFallback;
    const rounded = Math.round(next * 10) / 10;
    setProgress(clampPercent(rounded));
  }, [myProgressFromBalances, myProgressFallback]);

  // ---------- 내 계좌 ----------
  useEffect(() => {
    if (!tripId) return;
    const planIdNum = Number(tripId);

    const rows = (balances ?? []) as any[];

    if (!rows.length) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      setLinkedForPlan(planIdNum, false);
      return;
    }

    const target = meId != null
      ? rows.find((b) => String(b.id) === String(meId))
      : rows[0];

    if (!target || target.balance == null) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      setLinkedForPlan(planIdNum, false);
      return;
    }

    setIsAccountLinked(true);
    setAccountBalance(Number(target.balance));
    setAccountLabel("연동된 계좌");
    setLinkedForPlan(planIdNum, true);
  }, [tripId, balances, meId]);

  // ---------- 멤버 ----------
  const groupMembers = useMemo(() => {
    if (balances.length) {
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

  const groupProgressPercent = useMemo(() => {
    if (groupMembers.length) {
      const avg =
        groupMembers.reduce((acc: number, cur: any) => acc + (cur.percent ?? 0), 0) /
        groupMembers.length;
      return clampPercent(avg);
    }
    return progress;
  }, [groupMembers, progress]);

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

  // ---------- 계좌 연동 완료 ----------
  const handleBankConnected = async (bankCode: string, acct: string) => {
    const planId = Number(tripId);
    setLinkedForPlan(planId, true);
    setBankOrgForPlan(planId, bankCode);

    await qc.invalidateQueries({ queryKey: TRIP_KEYS.balances(planId), exact: true });

    const bankName = BANK_NAME_BY_CODE[bankCode as keyof typeof BANK_NAME_BY_CODE] ?? '연동 계좌';
    const maskAccount = (s: string) => s.replace(/\d(?=\d{4})/g, '*');
    setIsAccountLinked(true);
    setAccountLabel(`${bankName} ${maskAccount(acct)}`);

    setOpenBank(false);
  };

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
        alert('플랜 삭제에 실패했어요.');
      },
    });
  };

  // ==============================
  // 로딩 화면
  // ==============================
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

  // ==============================
  // 에러 화면
  // ==============================
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

  // ==============================
  // 실제 화면
  // ==============================
  return (
    <div>
      <Container>
        <LeftIcon onClick={() => navigate(-1)} />
        <RightIcon onClick={() => setOpenMenu((s) => !s)} />
        {openMenu && (
          <Dropdown>
            <DropdownItem onClick={() => setOpenInvite(true)}>멤버 초대</DropdownItem>
            <DropdownItem style={{ color: '#ff7b7b' }} onClick={handleDeletePlan}>
              플랜 삭제
            </DropdownItem>
          </Dropdown>
        )}
      </Container>

      <TabWrapper>
        <TabItem $active={tab === "saving"} onClick={() => setTab("saving")}>
          저축 상세
        </TabItem>
        <TabItem $active={tab === "info"} onClick={() => setTab("info")}>
          부가적 정보
        </TabItem>
      </TabWrapper>

      {/* ⭐ 탭 1 : 저축 상세 */}
      {tab === "saving" && (
        <>
          <ProgressCard
            progress={progress}
            linked={isAccountLinked}
            accountLabel={accountLabel}
            balance={accountBalance}
            onClickLink={() => setOpenBank(true)}
            tip={tipForProgress}
          />

          <ExpenseCard tripId={id} savedPercent={progress} />

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

          <ExchangeRateCard destination={data.destination} />
        </>
      )}

      {/* ⭐ 탭 2 : Airport 페이지 */}
      {tab === "info" && (
        <div style={{ padding: "10px" }}>
          <Airport destination={destinationAirportCode} />
        </div>
      )}

      {/* 모달 */}
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
