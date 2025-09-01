import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const AssetCardContainer = styled(Card)`
  margin: 1rem;
  padding: 1rem 1.25rem;
`;

export const AssetHeader = styled.div`
  margin-bottom: 0.75rem;
`;

export const AssetTitle = styled.span`
  color: var(--color-text-highlight);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

export const AssetBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const AssetLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const BrandAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-accent-light);
  display: grid;
  place-items: center;
  overflow: hidden;
`;

export const BrandMark = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
`;

export const Amount = styled.span`
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
  margin-top: 0.2rem;
`;

export const SaveBtn = styled.button`
  border: 0;
  border-radius: var(--radius-button);
  padding: 0.4rem 0.7rem;
  background: var(--color-accent-light);
  color: black;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(6px);

  min-width: 4.5rem;
  text-align: center;

  &:hover {
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(1px);
  }
`;
