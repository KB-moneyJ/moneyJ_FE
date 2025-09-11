import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';

import { BANK_NAME_BY_CODE } from '@/constants/banks';

import { refreshTripPlanBalance } from '@/api/bank/bank';

import { useTripPlanDetail, useTripPlanBalances, useDeleteTripPlan } from '@/api/trips/queries';
import { useMe } from '@/api/users/queries';

const BANK_ORG_LS_KEY = 'bankOrgByPlanId';
const BANK_LINKED_LS_KEY = 'bankLinkedByPlanId';

function setBankOrgForPlan(planId: number, org: string) {
  try {
    const map = JSON.parse(localStorage.getItem(BANK_ORG_LS_KEY) || '{}');
    map[String(planId)] = org;
    localStorage.setItem(BANK_ORG_LS_KEY, JSON.stringify(map));
  } catch {}
}
function getBankOrgForPlan(planId: number): string | undefined {
  try {
    const map = JSON.parse(localStorage.getItem(BANK_ORG_LS_KEY) || '{}');
    return map[String(planId)];
  } catch {
    return undefined;
  }
}
function setLinkedForPlan(planId: number, linked: boolean) {
  try {
    const map = JSON.parse(localStorage.getItem(BANK_LINKED_LS_KEY) || '{}');
    if (linked) map[String(planId)] = true;
    else delete map[String(planId)];
    localStorage.setItem(BANK_LINKED_LS_KEY, JSON.stringify(map));
  } catch {}
}
function getLinkedForPlan(planId: number): boolean {
  try {
    const map = JSON.parse(localStorage.getItem(BANK_LINKED_LS_KEY) || '{}');
    return !!map[String(planId)];
  } catch {
    return false;
  }
}

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const location = useLocation() as { state?: { thumbnailUrl?: string } };
  const thumbFromList = location.state?.thumbnailUrl;

  const { data, isLoading, isError } = useTripPlanDetail(tripId);
  const { data: balances = [] } = useTripPlanBalances(tripId);
  const { data: me } = useMe();

  const { mutate: deletePlan, isPending: deleting } = useDeleteTripPlan();

  const [openMenu, setOpenMenu] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | undefined>(undefined);
  const [accountBalance, setAccountBalance] = useState<number | undefined>(undefined);

  const progress = data?.progressPercent ?? 0;

  const podiumTop3 = useMemo(() => {
    if (balances.length) {
      return balances.slice(0, 3).map((b) => ({
        id: b.id,
        name: b.name,
        percent: b.percent,
        avatarUrl: b.avatarUrl,
      }));
    }
    if (data?.members?.length) {
      const sorted = [...data.members].sort((a, b) => b.percent - a.percent);
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
  }, [balances, data?.members, me, progress]);

  const overview = useMemo(() => {
    if (!data) return null;
    return {
      destination: data.destination,
      countryCode: data.countryCode,
      period: data.period + (data.members.length ? ` (${data.members.length}명)` : ''),
      thumbnailUrl: thumbFromList ?? data.thumbnailUrl,
      progressPercent: data.progressPercent,
      members: data.members,
      tip: data.overviewTip,
    };
  }, [data, thumbFromList]);

  const checklist = data?.checklist ?? [];
  const cautions = data?.cautions ?? [];

  useEffect(() => {
    let mounted = true;
    if (!tripId) return;

    const planId = Number(tripId);
    const wasLinked = getLinkedForPlan(planId);

    if (!wasLinked) {
      setIsAccountLinked(false);
      setAccountLabel(undefined);
      setAccountBalance(undefined);
      return;
    }

    (async () => {
      try {
        const res = await refreshTripPlanBalance(planId);
        if (!mounted) return;

        const org = getBankOrgForPlan(planId);
        const bankName = org ? BANK_NAME_BY_CODE[org] : undefined;

        setIsAccountLinked(true);
        setAccountLabel(
          bankName ? `${bankName} ${res.accountNumberDisplay}` : res.accountNumberDisplay,
        );
        setAccountBalance(res.balance);
      } catch {
        if (!mounted) return;
        setLinkedForPlan(planId, false);
        setIsAccountLinked(false);
        setAccountLabel(undefined);
        setAccountBalance(undefined);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tripId]);

  const handleBankConnected = async (bankCode: string, acct: string) => {
    const planId = Number(tripId);
    setLinkedForPlan(planId, true);
    setBankOrgForPlan(planId, bankCode);

    try {
      const res = await refreshTripPlanBalance(planId);
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
        <div style={{ position: 'relative' }}>
          <RightIcon onClick={() => setOpenMenu((p) => !p)} />
          {openMenu && (
            <Dropdown>
              <DropdownItem
                onClick={() => {
                  setOpenMenu(false);
                  setOpenInvite(true);
                }}
              >
                친구 초대
              </DropdownItem>
              <DropdownItem onClick={handleDeletePlan}>
                {deleting ? '플랜 삭제 중…' : '플랜 삭제하기'}
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </Container>

      <ProgressCard
        progress={progress}
        tip={data.overviewTip ?? '오늘도 한 걸음! 목표가 가까워지고 있어요.'}
        linked={isAccountLinked}
        accountLabel={accountLabel}
        balance={accountBalance}
        onClickSave={() => {
          console.log('저축하기 클릭');
        }}
        onClickLink={() => {
          if (isAccountLinked) return;
          setOpenBank(true);
        }}
      />

      <ExpenseCard savedPercent={progress} tripId={Number(tripId)} />

      {overview && (
        <TripOverviewCard
          destination={overview.destination}
          countryCode={overview.countryCode}
          period={overview.period}
          thumbnailUrl={overview.thumbnailUrl}
          progressPercent={overview.progressPercent}
          members={overview.members}
          podiumImageUrl={podiumUrl}
          tip={overview.tip}
          podiumTop3={podiumTop3}
        />
      )}

      <BeforeYouGoCard
        destination={data.destination}
        checklist={checklist}
        cautions={cautions}
        tips={data.tips}
      />

      <FriendInviteModal
        isOpen={openInvite}
        onClose={() => setOpenInvite(false)}
        planId={tripId ?? ''}
      />

      <BankConnectModal
        isOpen={openBank}
        onClose={() => setOpenBank(false)}
        tripPlanId={Number(tripId)}
        onConnected={handleBankConnected}
      />
    </div>
  );
}
