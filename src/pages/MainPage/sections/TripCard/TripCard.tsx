import {
  TripCardContainer,
  Header,
  DestinationBox,
  DestinationText,
  PlaneIcon,
  Flag,
  ImageWrapper,
  Thumbnail,
  Period,
  ProgressBar,
  ProgressFill,
  ProgressLabel,
  DetailBtn,
} from './TripCard.style';

interface TripCardProps {
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  onClickDetail?: () => void;
}

export default function TripCard({
  destination,
  countryCode,
  period,
  thumbnailUrl,
  progressPercent,
  onClickDetail,
}: TripCardProps) {
  return (
    <TripCardContainer>
      <Header>
        <PlaneIcon />
        <DestinationBox>
          <DestinationText>{destination}</DestinationText>
          {countryCode && <Flag svg countryCode={countryCode} aria-label={countryCode} />}
        </DestinationBox>
      </Header>

      <ImageWrapper>
        <Thumbnail src={thumbnailUrl} alt={`${destination} 썸네일`} />
      </ImageWrapper>

      <Period>{period}</Period>

      <div>
        <ProgressBar>
          <ProgressFill $percent={progressPercent} />
        </ProgressBar>
        <ProgressLabel>{progressPercent}%</ProgressLabel>
      </div>

      <DetailBtn onClick={onClickDetail}>상세보기</DetailBtn>
    </TripCardContainer>
  );
}
