import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import { Plus } from 'lucide-react';

export const AddTripCardContainer = styled(Card).attrs({
  role: 'button',
  tabIndex: 0,
})`
  margin: 1rem;
  padding: 1.75rem 1.5rem;
  display: grid;
  justify-items: center;
  align-items: center;
  gap: 0.6rem;
  color: white;
  text-align: center;
  cursor: pointer;

  transition:
    transform 0.12s ease,
    filter 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 4px;
  }
`;

export const PlusIcon = styled(Plus).attrs({
  'aria-hidden': true,
  focusable: false,
})`
  width: 2.25rem;
  height: 2.25rem;
  opacity: 0.95;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
`;

export const Subtitle = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
`;
