import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import BeforeYouGoCard from './sections/BeforeYouGoCard/BeforeYouGoCard';
import FriendInviteModal from '@/components/modals/FriendInviteModal';
import BankConnectModal from '@/components/modals/BankConnectModal';
import podiumUrl from '@/assets/images/podium.svg';
import { BANK_NAME_BY_CODE } from '@/constants/banks';

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | undefined>(undefined);

  const [progress, setProgress] = useState(50);

  const detail = {
    destination: 'Tokyo, Japan',
    countryCode: 'JP',
    period: '2025.08.24 - 2025.08.29 (2명)',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1471623432079-b009d30b6729?q=80&w=1200&auto=format&fit=crop',
    members: [
      { id: 'u1', name: 'USERNAME1', percent: 92 },
      { id: 'u2', name: 'USERNAME2', percent: 72 },
      { id: 'u3', name: 'USERNAME3', percent: 47 },
      { id: 'u4', name: 'USERNAME4', percent: 37 },
    ],
    tip: '와우, 경비 반은 모았어요! 숙박비도 채워야 노숙투어 안 합니다 😎',
  };

  const checklist = [
    '여권, 항공권',
    '엔화 현금',
    '교통카드(Suica/PASMO)',
    '포켓와이파이/eSIM',
    '편한 신발, 보조배터리',
  ];

  const cautions = [
    '지하철 안 통화 금지',
    '소규모 가게는 현금만 가능',
    '흡연은 지정 구역에서만',
    '쓰레기통 적어 직접 챙겨야 함',
    '팁 문화 없음',
  ];

  useEffect(() => {
    // TODO: 초기 연동 상태를 API로 불러와서 setIsAccountLinked / setAccountLabel 설정
    // fetch(`/api/trips/${tripId}`).then(...);
  }, [tripId]);

  const maskAccount = (s: string) => s.replace(/\d(?=\d{4})/g, '*');

  const handleBankConnected = (bankCode: string, acct: string) => {
    const bankName = BANK_NAME_BY_CODE[bankCode] ?? '연동 계좌';
    setIsAccountLinked(true);
    setAccountLabel(`${bankName} ${maskAccount(acct)}`);
    setOpenBank(false);
  };

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
      <ProgressCard
        progress={progress}
        tip="오늘 커피 한 잔을 줄이면, 단 7일 안에 목표를 이룰 수 있습니다."
        linked={isAccountLinked}
        accountLabel={accountLabel}
        onClickSave={() => {
          console.log('저축하기 클릭');
        }}
        onClickLink={() => setOpenBank(true)}
      />

      <ExpenseCard savedPercent={progress} />

      <TripOverviewCard
        destination={detail.destination}
        countryCode={detail.countryCode}
        period={detail.period}
        thumbnailUrl={detail.thumbnailUrl}
        progressPercent={progress}
        members={detail.members}
        podiumImageUrl={podiumUrl}
        tip={detail.tip}
      />

      <BeforeYouGoCard destination={detail.destination} checklist={checklist} cautions={cautions} />
      <FriendInviteModal isOpen={openInvite} onClose={() => setOpenInvite(false)} />
      <BankConnectModal
        isOpen={openBank}
        onClose={() => setOpenBank(false)}
        onConnected={handleBankConnected}
      />
    </div>
  );
}
