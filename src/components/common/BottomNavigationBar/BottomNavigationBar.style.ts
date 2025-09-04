// BottomNavigationBar.style.ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  
  height: 70px;
  width: 100%
  background: rgba(255, 255, 255, 0.1); /* 투명한 배경 */
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* 경계선 살짝 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

export const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 12px;
  cursor: pointer;

  svg {
    margin-bottom: 4px;
  }
`;
