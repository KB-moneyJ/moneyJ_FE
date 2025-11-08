import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsageCardContainer,
  UsageCardContainerNoCard,
  Header,
  Caption,
  Amount,
  Bar,
  Seg,
  Tooltip,
  Legend,
  Dot,
  Divider,
  Tip,
  TipLabel,
  TipText,
} from './UsageCard.style';
import { getSummary } from '@/api/spending/spending';
import { CardButton } from '@/pages/AnalysisPage/SpendingPage.style';
import { useCardStore } from '@/stores/useCardStore';

type CategoryView = {
  name: string;
  amount: number;
  percent: number; // 0 ~ 1
  color: string;
};

const COLOR_PALETTE = [
  '#F8D66D',
  '#E891F7',
  '#6C63FF',
  '#5CC8FF',
  '#FF9F80',
  '#B0E57C',
  '#7FD1AE',
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
];

const toCurrency = (v: number) => v.toLocaleString('ko-KR');
const ymToLabel = (ym?: string) => {
  if (!ym) return '';
  const m = Number(ym.split('-')[1]);
  return `${m}월`;
};

export default function UsageCard() {
  const [hovered, setHovered] = useState<CategoryView | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { cardConnected, setCardConnected } = useCardStore();

  const goToSpending = () => {
    navigate('/spending');
  };

  useEffect(() => {
    (async () => {
      const data = await getSummary();
      setCardConnected(data.cardConnected ?? false);
      setSummary(data);
    })();
  }, []);

  // monthly의 가장 마지막(가장 최신) 달
  const lastMonth = useMemo(() => {
    const list = summary?.monthly ?? [];
    return list.length ? list[list.length - 1] : null;
  }, [summary]);

  // 이번 달 총합 (백엔드 값 우선)
  const monthTotal: number = useMemo(() => {
    if (!lastMonth) return 0;
    if (typeof lastMonth.monthTotalAmount === 'number') return lastMonth.monthTotalAmount;
    const sum = (lastMonth.categories ?? []).reduce(
      (acc: number, c: any) => acc + (Number(c.totalAmount) || 0),
      0,
    );
    return sum;
  }, [lastMonth]);

  // 차트/범례용 카테고리 배열
  const categories: CategoryView[] = useMemo(() => {
    if (!lastMonth) return [];
    const cats = (lastMonth.categories ?? []) as Array<{
      category: string;
      totalAmount: number;
      transactionCount?: number;
    }>;

    const total = monthTotal || cats.reduce((acc, c) => acc + (c.totalAmount || 0), 0) || 1;

    return cats
      .slice()
      .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
      .map((c, i) => ({
        name: c.category,
        amount: c.totalAmount || 0,
        percent: (c.totalAmount || 0) / total,
        color: COLOR_PALETTE[i % COLOR_PALETTE.length],
      }));
  }, [lastMonth, monthTotal]);

  const caption = lastMonth ? `${ymToLabel(lastMonth.month)} 사용 금액` : '이번 달 사용 금액';

  // 카드 연결 안 됐을 때 화면
  if (!cardConnected) {
    return (
      <UsageCardContainerNoCard>
        <Header>
          <Caption>카드가 연결되지 않았습니다</Caption>
        </Header>
        <CardButton onClick={goToSpending}>카드 연결하기</CardButton>
      </UsageCardContainerNoCard>
    );
  }

  return (
    <UsageCardContainer>
      <Header>
        <Caption>{caption}</Caption>
        <Amount>{toCurrency(monthTotal)}원</Amount>
      </Header>

      {/* 바 영역 */}
      <Bar>
        {categories.length === 0 ? (
          <Seg
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)' }}
            aria-label="데이터 없음"
          />
        ) : (
          categories.map((cat, i) => (
            <Seg
              key={i}
              style={{ flex: Math.max(cat.percent, 0.001), backgroundColor: cat.color }}
              onMouseEnter={() => setHovered(cat)}
              onMouseLeave={() => setHovered(null)}
              title={`${cat.name}: ${toCurrency(cat.amount)}원 (${Math.round(cat.percent * 100)}%)`}
            />
          ))
        )}
      </Bar>

      {/* 툴팁 */}
      {hovered && (
        <Tooltip>
          {hovered.name}: {toCurrency(hovered.amount)}원 ({Math.round(hovered.percent * 100)}%)
        </Tooltip>
      )}

      {/* 범례 */}
      <Legend>
        {categories.map((cat, i) => (
          <li key={i}>
            <Dot style={{ backgroundColor: cat.color }} />
            {cat.name}
          </li>
        ))}
      </Legend>

      <Divider />

      <Tip>
        <TipLabel>TIP</TipLabel>
        <TipText>
          “카테고리별 한도를 정하고 초과 시 알림을 받으면 소비를 더 쉽게 줄일 수 있어요.”
        </TipText>
      </Tip>
    </UsageCardContainer>
  );
}
