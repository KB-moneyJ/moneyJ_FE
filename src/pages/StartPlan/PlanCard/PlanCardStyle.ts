import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import { PlaneTakeoff } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

export const Wrapper=styled.div`
    display: flex;
    justify-content: center;
`
export const TripCardContainer = styled(Card)`
  color: white;
    width: 343px;
    height: 659px;
    margin-top: 16px;
`;

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
    width: 343px;
    height: 659px;
    box-sizing: border-box;

  border-radius: var(--radius-card);
  border: 1px solid rgba(255, 255, 255, 0.3);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 4px 2px rgba(255, 255, 255, 0.2);

  position: relative;
  overflow: hidden;

  color: #fff;
  padding: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.8),
      transparent,
      rgba(255, 255, 255, 0.3)
    );
  }
`;


export const Header = styled.div`
  display: flex;
    justify-content: space-between;
  margin-top: 10px;
`;

export const DestinationBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
`;

export const DestinationText = styled.span`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
    margin-left: 9px;
`;

export const PlaneIcon = styled(PlaneTakeoff)`
  width: 1.3rem;
  height: 1.3rem;
  color: white;
`;

export const Flag = styled(ReactCountryFlag)`
  width: 1.1rem;
  height: 1.1rem;
  margin-bottom: 0.1rem;
  border-radius: 0.125rem;
  line-height: 1;

  svg,
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const DimImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) brightness(0.45) saturate(0.6);
`;

export const Tiles = styled.div`
  position: absolute;
  inset: 0;
`;

export const Tile = styled.div<{
  $url: string;
  $rows: number;
  $cols: number;
  $row: number;
  $col: number;
  $visible: boolean;
}>`
  position: absolute;

  left: ${({ $col, $cols }) => `calc(100% * ${$col} / ${$cols})`};
  top: ${({ $row, $rows }) => `calc(100% * ${$row} / ${$rows})`};
  width: ${({ $cols }) => `calc(100% / ${$cols})`};
  height: ${({ $rows }) => `calc(100% / ${$rows})`};

  background-image: url(${({ $url }) => $url});
  background-size: ${({ $cols, $rows }) => `${$cols * 100}% ${$rows * 100}%`};
  background-position: ${({ $col, $cols, $row, $rows }) => {
    const x = $cols > 1 ? ($col / ($cols - 1)) * 100 : 0;
    const y = $rows > 1 ? ($row / ($rows - 1)) * 100 : 0;
    return `${x}% ${y}%`;
  }};

  background-repeat: no-repeat;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 320ms ease-in-out;
`;

export const Period = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: white;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: var(--progress-gradient);
  border-radius: 30px;
  transition: width 0.4s ease;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: flex-end;
  font-weight: 350;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

export const DetailBtn = styled.button`
  border: 0;
  border-radius: var(--radius-button);
  padding: 0.5rem;
  background: var(--color-button-primary);
  color: white;
  font-weight: 400;
  font-size: 0.75rem;
  cursor: pointer;
  text-align: center;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const PersonImg = styled.img`
  width: 18px;
    height: 16px;
`

export const ExpenseContainer = styled.div`
  margin-top: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
  
`
export const ExpenseText = styled.div`
  color: #cecece;
    font-size: 16px;
    font-weight: bold;
`
export const ModifyBtn = styled.button`
  width: 53px;
    height: 23px;
    background-color: #FCE5FF;
    color: black;
    border-radius: 5px;
    font-size: 12px;
`