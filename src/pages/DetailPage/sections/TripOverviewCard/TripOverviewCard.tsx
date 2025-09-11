import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Wrapper,
  Header,
  DestinationBox,
  DestinationText,
  PlaneIcon,
  Flag,
  Period,
  SectionTitle,
  ImageFrame,
  DimImage,
  Tiles,
  Tile,
  ProgressRow,
  ProgressBar,
  ProgressFill,
  ProgressRightLabel,
  Divider,
  Podium,
  PodiumWrap,
  TopAvatar,
  RankList,
  RankItem,
  RankNo,
  RankUser,
  RankPercent,
  AvatarImg,
  RankAvatarImg,
  AvatarBox,
  PodiumStage,
  CrownIcon,
} from './TripOverviewCard.style';
import { CircleUserRound } from 'lucide-react';

type Member = { id: string; name: string; percent: number; avatarUrl?: string };

type Props = {
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  members: Member[];
  tip?: string;
  podiumImageUrl?: string;
  podiumTop3?: Member[];
};

const TILE_ROWS = 2;
const TILE_COLS = 5;

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function RankAvatar({ url, alt }: { url?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(url) && !failed;

  return (
    <AvatarBox>
      {showImg ? (
        <img src={url} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <CircleUserRound aria-label={alt} />
      )}
    </AvatarBox>
  );
}

function PodiumAvatar({
  url,
  alt,
  pos,
}: {
  url?: string;
  alt: string;
  pos: 'first' | 'second' | 'third';
}) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(url) && !failed;

  return (
    <TopAvatar $pos={pos} $hasImage={showImg} aria-label={alt}>
      {pos === 'first' && <CrownIcon aria-hidden="true" />}
      {showImg ? (
        <AvatarImg src={url} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <CircleUserRound />
      )}
    </TopAvatar>
  );
}

export default function TripOverviewCard({
  destination,
  countryCode,
  period,
  thumbnailUrl,
  progressPercent,
  members,
  tip,
  podiumImageUrl,
  podiumTop3,
}: Props) {
  const totalTiles = TILE_ROWS * TILE_COLS;
  const orderRef = useRef<number[]>(shuffle([...Array(totalTiles).keys()]));
  const initialCount = Math.max(0, Math.min(totalTiles, Math.floor(progressPercent / 10)));
  const [openedCount, setOpenedCount] = useState<number>(initialCount);

  useEffect(() => {
    const next = Math.max(0, Math.min(totalTiles, Math.floor(progressPercent / 10)));
    setOpenedCount((prev) => (next > prev ? next : prev));
  }, [progressPercent]);

  useEffect(() => {
    setOpenedCount(initialCount);
    orderRef.current = shuffle([...Array(totalTiles).keys()]);
  }, [thumbnailUrl]);

  const visibleSet = useMemo(() => new Set(orderRef.current.slice(0, openedCount)), [openedCount]);

  const sortedMembers = useMemo(
    () =>
      [...members]
        .map((m) => ({
          ...m,
          percent: Number.isFinite(m.percent as any) ? m.percent : 0,
        }))
        .sort((a, b) => b.percent - a.percent),
    [members],
  );
  return (
    <Wrapper>
      <Header>
        <PlaneIcon />
        <DestinationBox>
          <DestinationText>{destination}</DestinationText>
          {countryCode && <Flag svg countryCode={countryCode} aria-label={countryCode} />}
        </DestinationBox>
      </Header>

      <Period>{period}</Period>

      <SectionTitle>그룹 진행도</SectionTitle>

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

      <ProgressRow>
        <ProgressBar
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={progressPercent} />
        </ProgressBar>
        <ProgressRightLabel>
          {(Math.round(progressPercent * 10) / 10).toFixed(1)}%
        </ProgressRightLabel>
      </ProgressRow>

      <Divider />

      {podiumImageUrl && (
        <PodiumWrap>
          <PodiumStage>
            {podiumTop3?.[1] && (
              <PodiumAvatar
                pos="second"
                url={podiumTop3[1].avatarUrl}
                alt={`${podiumTop3[1].name} 프로필`}
              />
            )}
            {podiumTop3?.[0] && (
              <PodiumAvatar
                pos="first"
                url={podiumTop3[0].avatarUrl}
                alt={`${podiumTop3[0].name} 프로필`}
              />
            )}
            {podiumTop3?.[2] && (
              <PodiumAvatar
                pos="third"
                url={podiumTop3[2].avatarUrl}
                alt={`${podiumTop3[2].name} 프로필`}
              />
            )}
            <Podium src={podiumImageUrl} alt="랭킹 단상" />
          </PodiumStage>
        </PodiumWrap>
      )}
      <RankList>
        {sortedMembers.map((m, idx) => (
          <RankItem key={m.id}>
            <RankNo>{idx + 1}</RankNo>
            <RankUser>
              <RankAvatar url={m.avatarUrl} alt={`${m.name} 프로필`} />
              {m.name}
            </RankUser>
            <RankPercent>{(Math.round((m.percent ?? 0) * 10) / 10).toFixed(1)}%</RankPercent>
          </RankItem>
        ))}
      </RankList>
    </Wrapper>
  );
}
