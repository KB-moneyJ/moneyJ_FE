import { CircleDollarSign } from 'lucide-react';
import {
  Wrapper,
  SaveBtn,
  Title,
  ProgressBar,
  ProgressFill,
  ProgressRightLabel,
  Divider,
  Tip,
  TipLabel,
  TipText,
  AccountText,
  CardLinkBtn,
  BalancePill,
  AccountRow,
} from './ProgressCard.style';

type Props = {
  progress: number;
  tip?: string;
  linked?: boolean;
  accountLabel?: string;
  balance?: number;
  onClickSave?: () => void;
  onClickLink?: () => void;
  onClickCardLink?: () => void;
};

export default function ProgressCard({
  progress,
  tip,
  linked,
  accountLabel,
  balance,
  onClickSave,
  onClickLink,
  onClickCardLink,
}: Props) {
  const isLinked = !!linked;
  const hasTip = typeof tip === 'string' && tip.trim().length > 0;

  return (
    <Wrapper>
      {!isLinked && <SaveBtn onClick={onClickLink}>계좌 연동하기</SaveBtn>}
      {isLinked && (
        <AccountRow>
          {accountLabel && <AccountText>{accountLabel}</AccountText>}
          {typeof balance === 'number' && (
            <BalancePill aria-label="모은 잔액">
              <CircleDollarSign size={14} style={{ marginRight: 4 }} />
              모은 잔액 {balance.toLocaleString()}원
            </BalancePill>
          )}
        </AccountRow>
      )}

      <Title>나의 진행 상황</Title>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProgressBar
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={progress} />
        </ProgressBar>
        <ProgressRightLabel>{progress}%</ProgressRightLabel>
      </div>

      <Divider />

      {hasTip ? (
        <Tip>
          <TipLabel>TIP</TipLabel>
          <TipText>{tip}</TipText>
        </Tip>
      ) : (
        <>
          <Tip>
            <TipLabel>여행지에 대한 TIP이 궁금하다면?</TipLabel>
          </Tip>
          <CardLinkBtn onClick={onClickCardLink}>카드 연결하기</CardLinkBtn>
        </>
      )}
    </Wrapper>
  );
}
