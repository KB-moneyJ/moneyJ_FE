import styled from 'styled-components';
import { CircleUserRound, Bell } from 'lucide-react';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BottomNavigationBarWrapper = styled.div`
    position: sticky; /* 부모 Page 내부에서는 sticky 가능 */
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    backdrop-filter: blur(15px);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
`;

export const Page = styled.div`
  overflow-y: auto;
  flex: 1;
    width: 100%;
    min-height: 800px;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  margin-top: 4.0625rem;
`;

export const Profile = styled.div`
  --avatar-size: clamp(2.5rem, 6vw, 3rem);
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

export const UserIcon = styled(CircleUserRound)`
  width: var(--avatar-size);
  height: var(--avatar-size);
  color: #bdbdbd;
`;

export const AvatarImg = styled.img`
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex: 0 0 var(--avatar-size);
  background: #2b2b2b;
`;

export const Nickname = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: white;
`;

export const BellIcon = styled(Bell)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  cursor: pointer;
`;

/* 필요 시 카드 주변 여백에 사용 가능 (현재는 미사용) */
export const CardSpacing = styled.div`
  margin: 1rem;
`;
