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
} from './ProgressCard.style';

type Props = {
  progress: number;
  tip?: string;
  onClickSave?: () => void;
};

export default function ProgressCard({ progress, tip, onClickSave }: Props) {
  return (
    <Wrapper>
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
      <SaveBtn onClick={onClickSave}>저축하기</SaveBtn>
    </Wrapper>
  );
}
