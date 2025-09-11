import { useMemo, useState, useEffect } from 'react';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import {
  Wrapper,
  TitleContainer,
  ChartContainer,
  LegendScroll,
  LegendWrapper,
  CategoryPanel,
  SavingsBanner,
  CardButton,
  Text,
} from './SpendingPage.style';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LegendProps } from 'recharts';
import CardConnectModal from '@/components/modals/CardConnectModal';
import { getSummary } from '@/api/spending/spending';
import { RandomSpinner } from '../StartPlan/steps/StepsStyle';

// 동적 카테고리
type CatKey = string;

// 색상 팔레트 (11개)
const COLOR_PALETTE = [
  '#F8D66D', // 노랑
  '#E891F7', // 보라핑크
  '#6C63FF', // 보라
  '#5CC8FF', // 하늘
  '#FF9F80', // 코랄
  '#B0E57C', // 연두
  '#7FD1AE', // 민트
  '#FF6B6B', // 레드
  '#FFD93D', // 진한 노랑
  '#6BCB77', // 초록
  '#4D96FF', // 파랑
];

const toCurrency = (v: number) => v.toLocaleString('ko-KR');
const toK = (v: number) =>
  v >= 1000 ? `${Math.round(v / 100)}`.replace(/(\d)$/, ',$1') + 'K' : `${v}`;

// "2025-09" → "9월"
const monthLabel = (isoYm: string) => {
  const m = Number(isoYm.split('-')[1]);
  return `${m}월`;
};

// month별 일수 (평년 기준)
const DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function SpendingPage() {
  const [selected, setSelected] = useState<CatKey>('');
  const [isCard, setIsCard] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]); // recharts용 [{month:'9월', '식비': 10000, ...}, ...]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getSummary(); // { cardConnected, monthly: [...] }
        if (cancelled) return;

        setSummary(res);
        setIsCard(!res?.cardConnected); // 카드 없으면 안내 노출

        // 1) 카테고리 중복 제거 (monthly[].categories[].category)
        const allCats: string[] = (res?.monthly ?? []).flatMap((m: any) =>
          (m.categories ?? []).map((c: any) => c.category as string),
        );
        const uniqueCats = Array.from(new Set(allCats));
        setCategories(uniqueCats);

        // 2) recharts 데이터로 변환
        const rows = (res?.monthly ?? []).map((m: any) => {
          const row: Record<string, number | string> = { month: monthLabel(m.month) };
          (m.categories ?? []).forEach((c: any) => {
            row[c.category] = c.totalAmount ?? 0;
          });
          // 없는 카테고리는 0 채움
          uniqueCats.forEach((cat) => {
            if (row[cat] == null) row[cat] = 0;
          });
          return row;
        });
        setChartData(rows);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? '요약 불러오기 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 카테고리 로딩 후 기본 선택값
  useEffect(() => {
    if (!selected && categories.length > 0) setSelected(categories[0]);
  }, [categories, selected]);

  // 카테고리 → 색상 매핑
  const COLORS: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(categories.map((c, i) => [c, COLOR_PALETTE[i % COLOR_PALETTE.length]])),
    [categories],
  );

  // 비교용 현재/이전 달 데이터 (chartData 기준)
  const curr = chartData[chartData.length - 1] ?? {};
  const prev = chartData[chartData.length - 2] ?? {};

  // 이번 달 총합
  const currentTotal = useMemo(() => {
    const monthly = summary?.monthly ?? [];
    if (monthly.length > 0) {
      const last = monthly[monthly.length - 1];
      if (typeof last?.monthTotalAmount === 'number') {
        return last.monthTotalAmount;
      }
    }
    return categories.reduce((sum, k) => sum + (Number(curr?.[k]) || 0), 0);
  }, [summary, categories, curr]);

  // 평균/증감 계산
  const metrics = useMemo(() => {
    const currMonthStr = (curr?.month as string) || '';
    const prevMonthStr = (prev?.month as string) || '';
    const currM = Number((currMonthStr || '0월').replace('월', '')) || 8;
    const prevM = Number((prevMonthStr || '0월').replace('월', '')) || 7;

    const currVal = (curr?.[selected] as number) ?? 0;
    const prevVal = (prev?.[selected] as number) ?? 0;

    const currAvg = currVal / (DAYS_BY_MONTH[(currM - 1 + 12) % 12] || 30);
    const prevAvg = prevVal / (DAYS_BY_MONTH[(prevM - 1 + 12) % 12] || 30);
    const diff = currAvg - prevAvg;

    return {
      currMonth: currMonthStr,
      prevMonth: prevMonthStr,
      currAvg,
      prevAvg,
      diff,
      isSaving: diff < 0,
      savingAbs: Math.abs(diff),
    };
  }, [chartData, selected]);

  const CHIP_MAX = 120;

  const [prevWidth, currWidth] = useMemo(() => {
    const prev = metrics.prevAvg;
    const curr = metrics.currAvg;

    if (prev === 0 && curr === 0) {
      return [0, 0];
    }

    if (prev >= curr) {
      return [CHIP_MAX, (curr / prev) * CHIP_MAX];
    } else {
      return [(prev / curr) * CHIP_MAX, CHIP_MAX];
    }
  }, [metrics.prevAvg, metrics.currAvg]);

  // 커스텀 범례
  function CustomLegend(_: LegendProps) {
    const items = categories;
    return (
      <LegendScroll>
        <LegendWrapper>
          {items.map((k) => {
            const currVal = (curr?.[k] as number) ?? 0;
            const prevVal = (prev?.[k] as number) ?? 0;
            const rate = ((currVal - prevVal) / Math.max(1, prevVal)) * 100;

            let pillClass = 'neutral';
            if (rate > 0) pillClass = 'down';
            else if (rate < 0) pillClass = 'up';

            return (
              <button
                type="button"
                key={k}
                className={`legend-item ${selected === k ? 'active' : ''}`}
                onClick={() => setSelected(k)}
              >
                <div className="row">
                  <span className="dot" style={{ backgroundColor: COLORS[k] || '#8884d8' }} />
                  <span className="label">{k}</span>
                </div>
                <div className="value">{toK(currVal)}</div>
                <div className={`pill ${pillClass}`}>
                  {rate > 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`}
                </div>
              </button>
            );
          })}
        </LegendWrapper>
      </LegendScroll>
    );
  }

  return (
    <div style={{ width: '402px' }}>
      <TitleContainer>
        <div>CONSUMPTION ANALYSIS</div>
      </TitleContainer>

      {/* ✅ 로딩 중이면 RandomSpinner 표시 */}
      {loading && (
        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
          <RandomSpinner />
        </div>
      )}
      {error && <div style={{ padding: 12, color: 'red' }}>{error}</div>}

      {!loading && ( // ✅ 로딩 아닐 때만 내용 렌더링
        <>
          {isCard ? (
            <Wrapper>
              <Text>
                연결된 카드가 없습니다
                <br />
                소비 분석을 위해 카드를 연동해주세요
              </Text>
              <CardButton onClick={() => setIsConnectOpen(true)}>카드 연동하기</CardButton>
            </Wrapper>
          ) : (
            <Wrapper>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  marginBottom: '2px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 20 }}>
                  이번달 총합: {toCurrency(currentTotal)} 원
                </div>
              </div>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} barCategoryGap="25%">
                    <XAxis dataKey="month" />
                    <Tooltip
                      formatter={(v) => `${toCurrency(v as number)} 원`}
                      contentStyle={{
                        background: 'rgba(30, 30, 30, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3),
                          inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                        `,
                        borderRadius: '12px',
                        padding: '10px 14px',
                      }}
                      labelStyle={{
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    />
                    <Legend verticalAlign="bottom" align="center" content={<CustomLegend />} />
                    {categories.map((k) => (
                      <Bar key={k} dataKey={k} stackId="a" fill={COLORS[k] || '#8884d8'} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <CategoryPanel>
                <div className="section-title">CATEGORY GOALS</div>
                <div className="line1">
                  <span>경서님이 선택한 카테고리:</span>
                  <span className="chip" style={{ background: COLORS[selected] || '#8884d8' }}>
                    {selected || '-'}
                  </span>
                </div>
                <div className="helper">한 달 동안 하루 평균 이렇게 썼어요!</div>

                <div className="row">
                  <span className="month">{metrics.prevMonth}</span>
                  <span
                    className="color-chip"
                    style={{
                      background: COLORS[selected] || '#8884d8',
                      width: `${prevWidth}px`,
                    }}
                  />
                  <span className="amount">{toCurrency(Math.round(metrics.prevAvg))} 원</span>
                </div>

                <div className="row current">
                  <span className="month">{metrics.currMonth}</span>
                  <span
                    className="color-chip"
                    style={{
                      background: COLORS[selected] || '#8884d8',
                      width: `${currWidth}px`,
                    }}
                  />
                  <span className="amount current">
                    {toCurrency(Math.round(metrics.currAvg))} 원
                  </span>
                </div>
              </CategoryPanel>

              <SavingsBanner className={metrics.isSaving ? 'saving' : 'increase'}>
                <span className="emoji">🎉</span>
                <span>
                  {metrics.isSaving
                    ? `${metrics.prevMonth}보다 ${toCurrency(Math.round(metrics.savingAbs))}원 절약중`
                    : `${metrics.prevMonth}보다 ${toCurrency(Math.round(metrics.savingAbs))}원 증가`}
                </span>
              </SavingsBanner>
            </Wrapper>
          )}
        </>
      )}

      <CardConnectModal isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      <BottomNavigationBar />
    </div>
  );
}
