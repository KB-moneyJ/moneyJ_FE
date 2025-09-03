import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';
import TripOverviewCard from './sections/TripOverviewCard/TripOverviewCard';
import podiumUrl from '@/assets/images/podium.svg';

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  // TODO: API 연동
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

  useEffect(() => {
    // fetch(`/api/trips/${tripId}`).then(...);
  }, [tripId]);

  return (
    <div>
      <Container>
        <LeftIcon onClick={() => navigate(-1)} />
        <div style={{ position: 'relative' }}>
          <RightIcon onClick={() => setOpenMenu((p) => !p)} />
          {openMenu && (
            <Dropdown>
              <DropdownItem onClick={() => console.log('친구 초대')}>친구 초대</DropdownItem>
              <DropdownItem onClick={() => console.log('플랜 삭제하기')}>
                플랜 삭제하기
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </Container>
      <ProgressCard
        progress={progress}
        onClickSave={() => console.log('저축하기 클릭')}
        tip="오늘 커피 한 잔을 줄이면, 단 7일 안에 목표를 이룰 수 있습니다."
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
    </div>
  );
}
