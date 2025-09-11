// src/pages/DetailPage/sections/TripOverviewCard/TripOverviewCard.tsx
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

type Member = { id: string; name: string; percent: number | string; avatarUrl?: string };

type Props = {
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  /** 멤버가 없을 때 사용할 폴백 진행률(%) */
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
const clampPct = (n: number) => Math.max(0, Math.min(100, n));
const toPct = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
};

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
  // 1) 멤버 퍼센트 정규화(문자도 숫자로 변환)
  const normalizedMembers = useMemo(
    () =>
      (members ?? []).map((m) => ({
        ...m,
        percent: clampPct(toPct(m.percent)),
      })),
    [members],
  );

  // 2) 그룹 평균(멤버 있으면 평균, 없으면 폴백 progressPercent)
  const groupAvg = useMemo(() => {
    if (normalizedMembers.length === 0) return clampPct(toPct(progressPercent));
    const sum = normalizedMembers.reduce((acc, m) => acc + toPct(m.percent), 0);
    return clampPct(sum / normalizedMembers.length);
  }, [normalizedMembers, progressPercent]);

  // 3) 타일 퍼즐(그룹 평균에 맞춰 열림)
  const totalTiles = TILE_ROWS * TILE_COLS;
  const orderRef = useRef<number[]>(shuffle([...Array(totalTiles).keys()]));
  const initialCount = Math.max(0, Math.min(totalTiles, Math.floor(groupAvg / 10)));
  const [openedCount, setOpenedCount] = useState<number>(initialCount);

  // 평균 변동 시 더 많이 열리도록(되감기는 방지)
  useEffect(() => {
    const next = Math.max(0, Math.min(totalTiles, Math.floor(groupAvg / 10)));
    setOpenedCount((prev) => (next > prev ? next : prev));
  }, [groupAvg, totalTiles]);

  // 썸네일이 바뀌면 순서/카운트 초기화
  useEffect(() => {
    setOpenedCount(Math.max(0, Math.min(totalTiles, Math.floor(groupAvg / 10))));
    orderRef.current = shuffle([...Array(totalTiles).keys()]);
  }, [thumbnailUrl, groupAvg, totalTiles]);

  const visibleSet = useMemo(() => new Set(orderRef.current.slice(0, openedCount)), [openedCount]);

  // 4) 랭킹 표시용 정렬(개인 퍼센트 숫자 보장)
  const sortedMembers = useMemo(
    () => [...normalizedMembers].sort((a, b) => toPct(b.percent) - toPct(a.percent)),
    [normalizedMembers],
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
          aria-valuenow={groupAvg}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={groupAvg} />
        </ProgressBar>
        <ProgressRightLabel>{(Math.round(groupAvg * 10) / 10).toFixed(1)}%</ProgressRightLabel>
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
            {/* ✅ 개인 진행률 숫자 표기 (소수 1자리 고정) */}
            <RankPercent>{(Math.round(toPct(m.percent) * 10) / 10).toFixed(1)}%</RankPercent>
          </RankItem>
        ))}
      </RankList>
    </Wrapper>
  );
}
