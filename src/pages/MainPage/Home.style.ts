import styled from 'styled-components';
import { CircleUserRound, Bell } from 'lucide-react';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  margin-top: 4.0625rem;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const UserIcon = styled(CircleUserRound)`
  width: 1.875rem;
  height: 1.875rem;
  color: #bdbdbd;
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
