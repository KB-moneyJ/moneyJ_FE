import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import {
  Header as BaseHeader,
  DestinationBox,
  DestinationText,
  PlaneIcon,
  Flag,
  ImageFrame as BaseImageFrame,
  DimImage as BaseDimImage,
  Tiles as BaseTiles,
  Tile as BaseTile,
  ProgressBar as BaseProgressBar,
  ProgressFill as BaseProgressFill,
} from '@/pages/MainPage/sections/TripCard/TripCard.style';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 1rem 1.25rem;
  color: white;
`;

export const Header = styled(BaseHeader)`
  margin-bottom: 0.6rem;
`;

export { DestinationBox, DestinationText, PlaneIcon, Flag };

export const Period = styled.span`
  margin-top: 0.25rem;
  opacity: 0.9;
  font-size: 0.9rem;
`;

export const SectionTitle = styled.h4`
  margin: 0.9rem 0 0.6rem;
  font-size: 1rem;
  font-weight: 800;
`;

export const ImageFrame = styled(BaseImageFrame)`
  border-radius: 14px;
  overflow: hidden;
  margin: 0.4rem 0 0.9rem;
`;

export const DimImage = styled(BaseDimImage)``;
export const Tiles = styled(BaseTiles)``;
export const Tile = styled(BaseTile)``;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
`;

export const ProgressBar = styled(BaseProgressBar)`
  margin-top: 0;
`;

export const ProgressFill = styled(BaseProgressFill)``;

export const ProgressRightLabel = styled.span`
  display: inline-block;
  margin-left: 0.6rem;
  font-size: 0.9rem;
  position: relative;
  top: 0.2rem;
  opacity: 0.95;
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

export const Podium = styled.img`
  width: 160px;
  display: block;
  margin: 3rem auto 2rem;
  opacity: 0.95;
`;

export const RankList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  row-gap: 1rem;
`;

export const RankItem = styled.li`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  column-gap: 0.9rem;
  align-items: center;
  font-size: 0.95rem;
  opacity: 0.95;
`;

export const RankNo = styled.span`
  font-weight: 800;
  text-align: center;
`;

export const RankUser = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > svg {
    width: 1.125rem;
    height: 1.125rem;
    color: #bdbdbd;
    flex-shrink: 0;
  }
`;

export const RankPercent = styled.span`
  font-weight: 600;
  letter-spacing: 0.2px;
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
  opacity: 0.95;
`;
