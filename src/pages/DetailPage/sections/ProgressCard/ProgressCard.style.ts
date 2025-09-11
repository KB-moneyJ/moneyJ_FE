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
  display: flex;
  flex-direction: column;
  row-gap: 0.8rem;
`;

export const SaveBtn = styled(DetailBtn).attrs({ as: 'button' })`
  width: 100%;
`;

export const CardLinkBtn = styled(DetailBtn).attrs({ as: 'button' })`
  width: 100%;
`;

export const AccountText = styled.div`
  color: var(--color-text-highlight);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.2px;
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

export const BalancePill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff3b0;
  color: #7a5a00;
  padding: 8px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;

  svg {
    margin-right: 4px;
    vertical-align: middle;
    position: relative;
    top: -0.5px;
  }
`;

export const AccountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;
