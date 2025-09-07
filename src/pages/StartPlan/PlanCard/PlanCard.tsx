import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Header,
  DestinationBox,
  DestinationText,
  PlaneIcon,
  Flag,
  ImageFrame,
  DimImage,
  Tiles,
  Tile,
  ProgressBar,
  ProgressFill,
  ProgressLabel,
  Wrapper,
  GlassCard, Amount, CheckMark, EditBtn, Item,
  Label, Price,
  Title, Date, Divider, Description, ItemList2, ItemContainer,
} from './PlanCardStyle';
import EditModal from '@/components/common/EditModeal';
import { Check, Home, Plane, Utensils } from 'lucide-react';

const TILE_ROWS = 2;
const TILE_COLS = 5;

interface PlanCardProps {
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  savedPercent?: number; // 선택적, 기본값 처리
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

type ExpenseItem = {
  id: string;
  label: string;
  amount: number;
  icon: React.ReactNode;
};

const baseItems: ExpenseItem[] = [
  { id: 'flight', label: '항공권', amount: 800000, icon: <Plane size={18} /> },
  { id: 'hotel', label: '숙박', amount: 1000000, icon: <Home size={18} /> },
  { id: 'food', label: '식비', amount: 400000, icon: <Utensils size={18} /> },
];

export default function PlanCard({
                                   destination,
                                   countryCode,
                                   period,
                                   thumbnailUrl,
                                   progressPercent,
                                   savedPercent = 0, // 기본값 0
                                 }: PlanCardProps) {
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
  }, [thumbnailUrl]);

  const visibleSet = useMemo(() => new Set(orderRef.current.slice(0, openedCount)), [openedCount]);

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<ExpenseItem[]>(baseItems);
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const clamped = Math.max(0, Math.min(100, savedPercent));
  let remaining = Math.round((total * clamped) / 100);

  const coveredSet = new Set<string>();
  for (const i of items) {
    if (remaining >= i.amount) {
      coveredSet.add(i.id);
      remaining -= i.amount;
    } else {
      break;
    }
  }

  return (
    <Wrapper>
      <GlassCard>
        <Header>
          <div style={{ display: 'flex'}}>
            <PlaneIcon />
            <DestinationBox>
              <DestinationText>{destination}</DestinationText>
              {countryCode && <Flag svg countryCode={countryCode} aria-label={countryCode} />}
            </DestinationBox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '55px', justifyContent:'space-around' }}>
            <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1052 8.18763C11.1996 8.23892 11.2901 8.29148 11.3813 8.34757C12.3626 8.92938 13.4723 9.10836 14.5977 8.88335C15.1296 8.74857 15.6334 8.54279 16.0898 8.2488C16.2022 8.18563 16.2674 8.15059 16.3976 8.14944C16.4904 8.19689 16.5656 8.24232 16.6488 8.30222C16.6715 8.31807 16.6943 8.33392 16.7178 8.35025C17.0171 8.56111 17.2777 8.78896 17.5118 9.06612C17.5396 9.09906 17.5675 9.132 17.5962 9.16594C18.5688 10.3616 18.9782 11.8982 18.9965 13.3965C18.9977 13.429 18.9988 13.4614 19 13.4948C19.0026 13.7418 18.9407 13.8744 18.7621 14.0578C16.9793 15.4012 13.1155 14.9846 11.0071 14.7471C8.87091 14.4891 8.87091 14.4891 8.37336 13.9178C8.29234 13.7434 8.30209 13.5783 8.30481 13.3894C8.30518 13.3489 8.30556 13.3085 8.30594 13.2669C8.33757 11.6312 8.85758 9.94981 10.0706 8.76056C10.7986 8.09321 10.7986 8.09321 11.1052 8.18763Z" fill="white"/>
              <path d="M2.86809 6.3539C2.97317 6.41 2.97317 6.41 3.077 6.48758C3.99577 7.10854 5.14112 7.24967 6.22914 7.08364C6.79396 6.98457 7.37944 6.75071 7.84136 6.42238C7.97846 6.34424 8.04371 6.3316 8.20026 6.3539C8.71306 6.6008 9.3784 7.19464 9.63279 7.69074C9.62981 7.8089 9.59186 7.84462 9.50486 7.92961C9.46911 7.9587 9.43336 7.9878 9.39652 8.01778C9.28323 8.11057 9.19839 8.1825 9.11549 8.30186C9.08923 8.30186 9.06296 8.30186 9.0359 8.30186C9.02236 8.33185 9.02236 8.33185 9.00855 8.36244C8.95252 8.46134 8.88524 8.54766 8.8139 8.63681C7.82714 9.87381 7.45456 11.3401 7.26235 12.8581C7.24525 12.9617 7.24525 12.9617 7.20546 12.9999C6.60814 13.0625 5.99973 13.0473 5.39988 13.0476C5.3479 13.0477 5.29591 13.0477 5.24235 13.0478C4.41823 13.0473 3.60623 13.0246 2.78851 12.9235C2.74194 12.9178 2.69538 12.9121 2.64741 12.9062C0.681148 12.6543 0.681149 12.6543 0.162212 12.1214C-0.193866 11.5715 0.12663 10.3867 0.268921 9.79288C0.32953 9.56005 0.401566 9.3316 0.48055 9.10396C0.48988 9.07658 0.499209 9.0492 0.508821 9.02099C0.770161 8.26631 1.18341 7.61826 1.75391 7.04141C1.78889 7.00582 1.82387 6.97022 1.85991 6.93354C2.48618 6.31294 2.48618 6.31294 2.86809 6.3539Z" fill="white"/>
              <path d="M15.7609 2.57269C15.7929 2.59584 15.8248 2.61898 15.8578 2.64282C16.4009 3.08242 16.7458 3.81812 16.8353 4.48246C16.8999 5.36427 16.7173 6.14378 16.1439 6.8458C15.5963 7.45021 14.8564 7.88439 14.0101 7.95824C13.0541 8.01423 12.1962 7.78852 11.4719 7.17717C10.9115 6.66039 10.4773 5.92419 10.4591 5.16326C10.4425 4.29498 10.6186 3.54824 11.2246 2.87826C11.255 2.83966 11.2853 2.80105 11.3166 2.76128C12.4665 1.55488 14.4993 1.52403 15.7609 2.57269Z" fill="white"/>
              <path d="M7.48412 0.701071C8.11987 1.21999 8.52876 1.98327 8.60754 2.78065C8.66608 3.68662 8.37513 4.50095 7.75599 5.18947C7.21994 5.73758 6.44982 6.1083 5.66083 6.13764C4.78312 6.14986 3.97245 5.984 3.30593 5.3991C3.27043 5.36852 3.23493 5.33795 3.19836 5.30645C2.56736 4.73469 2.23326 3.97048 2.1919 3.14259C2.19108 2.35163 2.46213 1.65513 2.98759 1.04483C3.01293 1.01312 3.03827 0.981413 3.06437 0.948744C4.14283 -0.293467 6.24627 -0.251633 7.48412 0.701071Z" fill="white"/>
            </svg>
            2명
          </div>
        </Header>
        <Date>{period}</Date>
        <Divider />
        <Header>
          <div>
            <Title>예상 1인 경비</Title>
          </div>
          <EditBtn onClick={() => setShowModal(true)}>수정하기</EditBtn>
        </Header>
        <Amount>₩ {total.toLocaleString()}</Amount>

        <ItemList2>
          {items.map((i) => {
            const covered = coveredSet.has(i.id);
            return (
              <ItemContainer>
                <Item key={i.id} $covered={covered}>
                  <Label>
                    {i.icon}
                    {i.label}
                  </Label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Price>₩{i.amount.toLocaleString()}</Price>
                  </div>
                </Item>
                <CheckMark $visible={covered}>
                  <Check size={24} strokeWidth={4} />
                </CheckMark>
              </ItemContainer>
            );
          })}
        </ItemList2>
        <Description>
          함께 저축해 목표를 채우고<br/>
          여행지 그림을 완성해보세요!
        </Description>
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

        <div style={{width:'100%'}}>
          <div style={{fontSize:'15px', marginTop:'8px'}}>목표금액 :{total.toLocaleString()}</div>
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
        {showModal && (
          <EditModal
            items={items}
            coveredSet={coveredSet}
            onSave={(updated) => setItems(updated)}
            onClose={() => setShowModal(false)}
          />
        )}
      </GlassCard>

    </Wrapper>
  );
}
