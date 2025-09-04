// BottomNavigationBar.tsx
import { FaHome, FaPlane, FaChartPie, FaUser } from 'react-icons/fa';
import { Wrapper, NavItem } from './BottomNavigationBar.style';

export default function BottomNavigationBar() {
  return (
    <Wrapper>
      <NavItem>
        <FaHome size={24} />
        <span>HOME</span>
      </NavItem>
      <NavItem>
        <FaPlane size={24} />
        <span>PLAN</span>
      </NavItem>
      <NavItem>
        <FaChartPie size={24} />
        <span>SPENDING</span>
      </NavItem>
      <NavItem>
        <FaUser size={24} />
        <span>PROFILE</span>
      </NavItem>
    </Wrapper>
  );
}
