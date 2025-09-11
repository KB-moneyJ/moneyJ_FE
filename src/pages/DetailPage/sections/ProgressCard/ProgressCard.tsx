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
} from './ProgressCard.style';

type Props = {
  progress: number;
  tip?: string;
  linked?: boolean;
  accountLabel?: string;
  onClickSave?: () => void;
  onClickLink?: () => void;
  onClickCardLink?: () => void;
};

export default function ProgressCard({
  progress,
  tip,
  linked,
  accountLabel,
  onClickSave,
  onClickLink,
  onClickCardLink,
}: Props) {
  const isLinked = !!linked;
  const hasTip = typeof tip === 'string' && tip.trim().length > 0;

  return (
    <Wrapper>
      <SaveBtn onClick={isLinked ? onClickSave : onClickLink}>
        {isLinked ? '저축하기' : '계좌 연동하기'}
      </SaveBtn>

      {isLinked && accountLabel && <AccountText>{accountLabel}</AccountText>}

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
