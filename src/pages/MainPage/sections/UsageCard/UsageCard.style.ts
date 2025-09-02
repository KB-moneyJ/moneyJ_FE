import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const UsageCardContainer = styled(Card)`
  margin: 1rem;
  padding: 1rem 1.25rem;
  color: white;
`;

export const Header = styled.div`
  display: grid;
  gap: 0.25rem;
`;

export const Caption = styled.span`
  font-size: 0.95rem;
  opacity: 0.9;
`;

export const Amount = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 1.35rem;
`;

export const Bar = styled.div`
  margin-top: 0.9rem;
  height: 0.8rem;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.15);
`;

export const Seg = styled.div`
  height: 100%;
`;

export const Tooltip = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
`;

export const Legend = styled.ul`
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;
  display: inline-flex;
  flex-wrap: wrap;
  column-gap: 1.8rem;
  row-gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.95;
`;

export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.4rem;
`;

export const Divider = styled.hr`
  margin: 0.9rem 0 0.8rem;
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0)
  );
`;

export const Tip = styled.div`
  display: grid;
  gap: 0.35rem;
`;

export const TipLabel = styled.span`
  color: var(--color-text-highlight);
  font-weight: 600;
`;

export const TipText = styled.p`
  margin: 0;
  line-height: 1.45;
`;
