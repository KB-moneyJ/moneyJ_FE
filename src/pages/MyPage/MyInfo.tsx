import {
  Page,
  Header,
  ProfileWrap,
  AvatarCircle,
  AvatarIcon,
  EditBadge,
  Username,
  LogoutBtn,
  Item,
  Wrapper,
} from './MyInfo.style';
import { FiLogOut } from 'react-icons/fi';
import { FiEdit2 } from 'react-icons/fi';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { useState } from 'react';
import { logout } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

export default function Myinfo() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const goLogout = async () => {
    try {
      const result = await logout();
      console.log('로그아웃 성공:', result);
      if (result.status === 'success') {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('로그아웃에 실패했습니다.');
      }
    } catch (err) {
      console.error('로그아웃 중 오류 발생:', err);
    }
  };

  return (
    <Wrapper>
      <Page>
        <Header>
          <div />
        </Header>

        <ProfileWrap>
          <AvatarCircle>
            <AvatarIcon>👤</AvatarIcon>
            <EditBadge>
              <FiEdit2 size={12} />
            </EditBadge>
          </AvatarCircle>
          <Username>USERNAME</Username>
        </ProfileWrap>
        <LogoutBtn type="button" onClick={() => setOpen(true)}>
          <Item>
            <FiLogOut />
            <span>로그아웃</span>
          </Item>
        </LogoutBtn>
      </Page>
      <BottomNavigationBar />
      <ConfirmModal
        open={open}
        title="로그아웃"
        description={
          <>
            접속 중인 아이디로
            <br /> 정말 로그아웃 하시겠습니까?
          </>
        }
        cancelText="취소"
        confirmText="로그아웃"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          goLogout();
          setOpen(false);
        }}
      />
    </Wrapper>
  );
}
