import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineChartPie,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2';
import { Wrapper, NavItem } from './BottomNavigationBar.style';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavigationBar() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인

  const goToHome = () => navigate('/home');
  const goToPlan = () => navigate('/plan');
  const goToSpending = () => navigate('/spending');
  const goToProfile = () => navigate('/mypage');

  return (
    <Wrapper>
      <NavItem onClick={goToHome} $active={location.pathname === '/home'}>
        <HiOutlineHome size={24} />
        <span>HOME</span>
      </NavItem>
      <NavItem onClick={goToPlan} $active={location.pathname === '/plan'}>
        <HiOutlinePaperAirplane size={24} />
        <span>PLAN</span>
      </NavItem>
      <NavItem onClick={goToSpending} $active={location.pathname === '/spending'}>
        <HiOutlineChartPie size={24} />
        <span>SPENDING</span>
      </NavItem>
      <NavItem onClick={goToProfile} $active={location.pathname === '/mypage'}>
        <HiOutlineUser size={24} />
        <span>PROFILE</span>
      </NavItem>
    </Wrapper>
  );
}
