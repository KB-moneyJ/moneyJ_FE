import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, LeftIcon, RightIcon, Dropdown, DropdownItem } from './DetailPage.style';
import ProgressCard from './sections/ProgressCard/ProgressCard';
import ExpenseCard from './sections/ExpenseCard/ExpenseCard';

export default function DetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  // TODO: API 연동
  const [progress, setProgress] = useState(92);

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
    </div>
  );
}
