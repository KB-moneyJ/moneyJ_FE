import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 1rem 1.25rem;
  color: white;
  display: flex;
  flex-direction: column;
`;

export const TitleBadge = styled.span`
  color: var(--color-text-highlight);
  font-weight: 800;
  letter-spacing: 0.2px;
`;

export const TitleDestination = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
`;

export const RateInfo = styled.p`
  margin-top: 8px;
  font-weight: 600;
`;

export const InputRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InputField = styled.input`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 120px;
  background-color: transparent;
  color: white;

  &:focus {
    outline: none;
    border-color: var(--color-text-highlight);
  }
`;

export const CurrencyLabel = styled.span`
  font-weight: 500;
`;

export const EqualSign = styled.span`
  font-weight: 500;
`;

export const ResultValue = styled.span``;

export const UpdateText = styled.small`
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  display: block;
`;
