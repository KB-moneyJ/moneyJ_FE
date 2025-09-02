import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import {
  DetailBtn,
  ProgressBar as BaseProgressBar,
  ProgressFill as BaseProgressFill,
} from '@/pages/MainPage/sections/TripCard/TripCard.style';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 1.4rem 1.5rem;
  color: white;
`;

export const SaveBtn = styled(DetailBtn).attrs({ as: 'button' })`
  width: 100%;
  margin: 0.5rem 0 1rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 1.35rem;
`;

export const ProgressBar = styled(BaseProgressBar)`
  margin-top: 0.9rem;
`;

export const ProgressFill = styled(BaseProgressFill)``;

export const ProgressRightLabel = styled.span`
  display: inline-block;
  margin-left: 0.7rem;
  font-size: 0.9rem;
  opacity: 0.9;
  position: relative;
  top: 0.5rem;
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
