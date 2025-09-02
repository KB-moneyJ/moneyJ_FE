import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TripCardContainer,
  Header,
  DestinationBox,
  DestinationText,
  PlaneIcon,
  Flag,
  ImageFrame,
  DimImage,
  Tiles,
  Tile,
  Period,
  ProgressBar,
  ProgressFill,
  ProgressLabel,
  DetailBtn,
} from './TripCard.style';

const TILE_ROWS = 2;
const TILE_COLS = 5;

interface TripCardProps {
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  onClickDetail?: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TripCard({
  destination,
  countryCode,
  period,
  thumbnailUrl,
  progressPercent,
  onClickDetail,
}: TripCardProps) {
  const totalTiles = TILE_ROWS * TILE_COLS;

  const orderRef = useRef<number[]>(shuffle([...Array(totalTiles).keys()]));

  const initialCount = Math.max(0, Math.min(totalTiles, Math.floor(progressPercent / 10)));
  const [openedCount, setOpenedCount] = useState<number>(initialCount);

  useEffect(() => {
    const next = Math.max(0, Math.min(totalTiles, Math.floor(progressPercent / 10)));
    setOpenedCount((prev) => (next > prev ? next : prev));
  }, [progressPercent, totalTiles]);

  useEffect(() => {
    setOpenedCount(initialCount);
    orderRef.current = shuffle([...Array(totalTiles).keys()]);
  }, [thumbnailUrl /* 또는 destination */]);

  const visibleSet = useMemo(() => new Set(orderRef.current.slice(0, openedCount)), [openedCount]);

  return (
    <TripCardContainer>
      <Header>
        <PlaneIcon />
        <DestinationBox>
          <DestinationText>{destination}</DestinationText>
          {countryCode && <Flag svg countryCode={countryCode} aria-label={countryCode} />}
        </DestinationBox>
      </Header>

      <ImageFrame>
        <DimImage src={thumbnailUrl} alt={`${destination} 썸네일`} />
        <Tiles>
          {Array.from({ length: TILE_ROWS }).map((_, r) =>
            Array.from({ length: TILE_COLS }).map((__, c) => {
              const index = r * TILE_COLS + c;
              return (
                <Tile
                  key={`${r}-${c}`}
                  $url={thumbnailUrl}
                  $rows={TILE_ROWS}
                  $cols={TILE_COLS}
                  $row={r}
                  $col={c}
                  $visible={visibleSet.has(index)}
                  aria-hidden
                />
              );
            }),
          )}
        </Tiles>
      </ImageFrame>

      <Period>{period}</Period>

      <div>
        <ProgressBar
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={progressPercent} />
        </ProgressBar>
        <ProgressLabel>{progressPercent}%</ProgressLabel>
      </div>

      <DetailBtn type="button" onClick={onClickDetail}>
        상세보기
      </DetailBtn>
    </TripCardContainer>
  );
}
