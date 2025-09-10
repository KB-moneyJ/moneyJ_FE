import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';
import { BANK_NAME_BY_CODE } from '@/constants/banks';
import { useTripPlanDetail } from '@/api/trips/queries';

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useTripPlanDetail(tripId);

  const [openMenu, setOpenMenu] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | undefined>(undefined);

  // 진행률은 서버 값 기반으로
  const progress = data?.progressPercent ?? 0;

  // Overview/BeforeYouGoCard에 들어갈 값 메모
  const overview = useMemo(() => {
    if (!data) return null;
    return {
      destination: data.destination,
      countryCode: data.countryCode,
      period: data.period + (data.members.length ? ` (${data.members.length}명)` : ''),
      thumbnailUrl: data.thumbnailUrl,
      progressPercent: data.progressPercent,
      members: data.members,
      tip: data.overviewTip,
    };
  }, [data]);

  const checklist = data?.checklist ?? [];
  const cautions = data?.cautions ?? [];

  useEffect(() => {
    // TODO: 초기 연동 상태를 API로 불러와서 setIsAccountLinked / setAccountLabel 설정 (있다면)
    // e.g., fetch(`/api/bank-link/${tripId}`)
  }, [tripId]);

  const maskAccount = (s: string) => s.replace(/\d(?=\d{4})/g, '*');

  const handleBankConnected = (bankCode: string, acct: string) => {
    const bankName = BANK_NAME_BY_CODE[bankCode] ?? '연동 계좌';
    setIsAccountLinked(true);
    setAccountLabel(`${bankName} ${maskAccount(acct)}`);
    setOpenBank(false);
  };

  const planNotFound =
    axios.isAxiosError(error) &&
    ((error as any).code === 'PLAN_NOT_FOUND' ||
      error.response?.status === 404 ||
      (error.response?.status === 500 &&
        typeof error.response?.data?.message === 'string' &&
        error.response?.data?.message.includes('저축 플랜이 존재하지 않습니다')));

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
              <DropdownItem onClick={() => console.log('플랜 삭제하기')}>
                플랜 삭제하기
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </Container>

      {/* 진행 상황 + 계좌 연동 */}
      <ProgressCard
        progress={progress}
        tip={data.overviewTip ?? '오늘도 한 걸음! 목표가 가까워지고 있어요.'}
        linked={isAccountLinked}
        accountLabel={accountLabel}
        onClickSave={() => {
          console.log('저축하기 클릭');
        }}
        onClickLink={() => setOpenBank(true)}
      />

      {/* 예상 경비(저축률만 사용 중) */}
      <ExpenseCard savedPercent={progress} />

      {/* 개요 카드 */}
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
        />
      )}

      {/* 체크리스트/주의사항 (백 응답에 없으면 빈 배열) */}
      <BeforeYouGoCard destination={data.destination} checklist={checklist} cautions={cautions} />

      {/* 모달들 */}
      <FriendInviteModal isOpen={openInvite} onClose={() => setOpenInvite(false)} />
      <BankConnectModal
        isOpen={openBank}
        onClose={() => setOpenBank(false)}
        onConnected={handleBankConnected}
      />
    </div>
  );
}
