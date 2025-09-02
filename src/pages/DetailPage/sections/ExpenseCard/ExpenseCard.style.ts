import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 2rem 1.5rem;
  color: white;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
`;

export const Amount = styled.h2`
  margin: 0.2rem 0 0;
  font-size: 1.8rem;
  font-weight: 800;
`;

export const EditBtn = styled.button`
  background: #fce5ff;
  border: none;
  border-radius: var(--radius-button);
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const ItemList = styled.div`
  margin-top: 1rem;
  display: grid;
  gap: 0.6rem;
`;

export const Item = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-card);
  border: 2px solid
    ${({ $selected }) => ($selected ? 'var(--color-text-highlight)' : 'rgba(255,255,255,0.4)')};
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    border-color: var(--color-text-highlight);
  }
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const Price = styled.span`
  font-weight: 500;
`;

export const CheckMark = styled.div`
  color: #00d000;
  font-size: 1.2rem;
`;
