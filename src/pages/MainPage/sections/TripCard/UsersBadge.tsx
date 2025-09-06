import { Users } from 'lucide-react';
import styled from 'styled-components';

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  transform: translateY(26px);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: white;
  font-weight: 500;
  pointer-events: none;

  svg {
    width: 1rem;
    height: 1rem;
  }
  span {
    font-size: 0.8rem;
    line-height: 1;
  }
`;

export default function UsersBadge({ count = 1 }: { count?: number }) {
  return (
    <Badge aria-label={`참여 인원 ${count}명`}>
      <Users />
      <span>{count}</span>
    </Badge>
  );
}
