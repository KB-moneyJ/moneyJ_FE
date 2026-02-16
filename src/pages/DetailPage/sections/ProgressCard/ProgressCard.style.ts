import styled from 'styled-components';
import Card from '@/components/common/Card/Card';
import {
  DetailBtn,
  ProgressBar as BaseProgressBar,
  ProgressFill as BaseProgressFill,
} from '@/pages/MainPage/sections/TripCard/TripCard.style';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const SaveBtn = styled(DetailBtn).attrs({ as: 'button' })`
  width: 100%;
`;

export const CardLinkBtn = styled(DetailBtn).attrs({ as: 'button' })`
  width: 100%;
`;

export const Title = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 1.35rem;
  margin-bottom: 16px;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const BankInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const BankName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

export const AccountNumber = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
`;

export const BalanceBig = styled.div`
  font-size: 38px;
  font-weight: 700;
  color: white;
  text-align: right;
  margin: 24px 0 16px;
  letter-spacing: -0.5px;
  width: 100%;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const ProgressBar = styled(BaseProgressBar)`
  height: 10px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 5px;
  margin-top: 0;
  flex: 1;
`;

export const ProgressFill = styled(BaseProgressFill)`
  background: linear-gradient(90deg, #FFEB3B 0%, #E91E63 100%);
  border-radius: 5px;
`;

export const ProgressRightLabel = styled.span`
  display: inline-block;
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

export const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
`;

export const Tip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TipLabel = styled.span`
  color: #E0aaff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
`;

export const TipText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
  text-align: center;
`;

export const RefreshButton = styled.button<{ $isRotating: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  
  &:disabled { opacity: 0.5; }
  
  svg {
    width: 14px;
    height: 14px;
    animation: ${(props) => (props.$isRotating ? 'rotate 1s linear infinite' : 'none')};
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
`;

export const UnlinkButton = styled.button`
  border: 0;
  border-radius: 20px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ChangeButton = styled(UnlinkButton)`
  /* same style */
`;
