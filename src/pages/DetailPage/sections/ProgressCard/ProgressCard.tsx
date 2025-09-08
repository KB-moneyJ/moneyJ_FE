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
} from './ProgressCard.style';

type Props = {
  progress: number;
  tip?: string;
  linked?: boolean;
  accountLabel?: string;
  onClickSave?: () => void;
  onClickLink?: () => void;
};

export default function ProgressCard({
  progress,
  tip,
  linked,
  accountLabel,
  onClickSave,
  onClickLink,
}: Props) {
  const isLinked = !!linked;

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
      <Tip>
        <TipLabel>TIP</TipLabel>
        <TipText>{tip ?? '오늘 커피 한 잔을 줄이면, 단 7일 안에 목표를 이룰 수 있습니다.'}</TipText>
      </Tip>
    </Wrapper>
  );
}
