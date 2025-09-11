import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import { Crown as CrownSvg } from 'lucide-react';
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
  font-weight: 600;
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

export const PodiumStage = styled.div`
  position: relative;
  display: inline-block;
`;

export const Podium = styled.img`
  width: 180px;
  display: block;
  margin: 0;
  opacity: 0.95;
`;

export const PodiumWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin: 5rem 0 1.5rem;
`;

export const TopAvatar = styled.div<{ $pos: 'first' | 'second' | 'third'; $hasImage?: boolean }>`
  position: absolute;
  z-index: 2;

  bottom: ${({ $pos }) => ($pos === 'first' ? '87%' : $pos === 'second' ? '58%' : '50%')};
  left: ${({ $pos }) => ($pos === 'first' ? '50%' : $pos === 'second' ? '15%' : '85.5%')};
  transform: translate(-50%, 0%);

  width: ${({ $pos }) => ($pos === 'first' ? '50px' : '40px')};
  height: ${({ $pos }) => ($pos === 'first' ? '50px' : '40px')};
  border-radius: 50%;
  overflow: visible;
  border: ${({ $pos, $hasImage }) =>
    $hasImage
      ? `2px solid ${$pos === 'first' ? '#edd718ff' : 'rgba(255, 255, 255, 0.9)'}`
      : 'none'};
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);

  & > svg:not(.crown) {
    width: 100%;
    height: 100%;
    padding: 0; /* ← 여기 때문에 밀렸음 */
    color: #cfcfcf;
  }
`;
export const CrownIcon = styled(CrownSvg).attrs({ className: 'crown' })`
  position: absolute;
  bottom: calc(100% + 3px);
  left: 50%;
  transform: translateX(-50%);

  width: 27px;
  height: 25px;

  stroke: #edd718ff;
  fill: none;
  pointer-events: none;
`;

export const AvatarBox = styled.div`
  width: var(--rank-avatar-size, 2rem);
  height: var(--rank-avatar-size, 2rem);
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > img,
  & > svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  & > img {
    object-fit: cover;
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  background: #2b2b2b;
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
  --rank-avatar-size: 2rem;
  --rank-gap: 0.6rem;

  display: inline-flex;
  align-items: center;
  gap: var(--rank-gap);
  font-weight: 600;
  letter-spacing: 0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const RankAvatarImg = styled.img`
  width: var(--rank-avatar-size);
  height: var(--rank-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  background: #2b2b2b;
`;
