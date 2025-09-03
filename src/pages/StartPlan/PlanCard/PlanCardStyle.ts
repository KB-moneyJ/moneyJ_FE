import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import { PlaneTakeoff } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

export const Wrapper=styled.div`
    display: flex;
    justify-content: center;
    
    
`


export const GlassCard = styled.div`
    /* CurrentTripCard */

    margin-top: 104px;

    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
    width: 343px;
    height: 659px;
    box-sizing: border-box;

  border: 1px solid rgba(255, 255, 255, 0.3);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 4px 2px rgba(255, 255, 255, 0.2);

  overflow: hidden;

  color: #fff;
  padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;

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
    align-items: center;
    width: 267px;
`;
export const Date = styled.div`
    font-size: 12px;
    margin-top: 8px;
    width: 267px;
`
export const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid rgba(255, 255, 255, 0.48);
  margin: 12px auto;    
  width: 90%;           
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
    margin-top: 14px;
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
  height: 7px;
  border-radius: 5px;
  background: white;
  overflow: hidden;
    margin-top: 9px;
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
  margin-top: 5px;
    font-size: 10px;

`;

export const Amount = styled.h2`
  margin: 0.2rem 0 0;
  font-size: 28px;
  font-weight: 800;
    width: 267px;
`;

export const EditBtn = styled.button`
  background: #fce5ff;
  border: none;
  border-radius: var(--radius-button);
    padding: 3px 8px;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const CheckMark = styled.div`
  color: #00d000;
  font-size: 1.5rem;
`;

export const ItemList = styled.div`
  margin-top: 1rem;
  display: grid;
  gap: 15px;
    justify-content: center;
`;

export const Item = styled.button<{ $covered?: boolean }>`
  display: flex;
  align-items: center;
    width: 267px;
    height: 39px;
  justify-content: space-between;
  border-radius: var(--radius-card);
  border: 0.4px solid white;
    background: transparent;
  color: white;
  cursor: default; /* 자동 계산이니 포인터는 유지하지 않음 */
  font-size: 0.95rem;

  &:hover {
    border-color: ${({ $covered }) =>
  $covered ? 'var(--color-text-highlight)' : 'rgba(255,255,255,0.4)'};
    background: ${({ $covered }) => ($covered ? 'rgba(61, 220, 90, 0.08)' : 'transparent')};
  }
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
    padding: 7px;
`;

export const Price = styled.span`
  font-weight: 500;
    padding:7px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
`;

export const Description = styled.div`
    width: 267px;
    font-size: 16px;
    color: #FFB1FF;
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 24px;
`