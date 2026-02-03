import React, { useMemo, useState, useEffect } from 'react';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import {
  Page,
  Wrapper,
  CategoryPanel,
  SavingsBanner,
  CardButton,
  Text,
  Dim,
  MenuButton,
  BottomCenterModal,
  ModalItem,
} from './SpendingPage.style';
import CardConnectModal from '@/components/modals/CardConnectModal';
import { useSummaryQuery } from '@/api/spending/queries';
import { RandomSpinner } from '../StartPlan/steps/StepsStyle';
import SpendingChart from './components/SpendingChart';

type CatKey = string;

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
const monthLabel = (isoYm: string) => `${Number(isoYm.split('-')[1])}월`;
const DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function SpendingPage() {
  const [selected, setSelected] = useState<CatKey>('');
  const [isCard, setIsCard] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const { data: res } = useSummaryQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** 🔹 요약 데이터 로드 */
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setSummary(res);
    } catch (e: any) {
      setError(e?.message ?? '요약 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  /** 첫 마운트 시 데이터 로드 */
  useEffect(() => {
    fetchSummary();

    try {
      const storedData = localStorage.getItem('me.public');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUsername(parsed.nickname || 'User');
      } else {
        setUsername('User');
      }
    } catch (e) {
      setUsername('User');
    }
  }, []);

  /** chartData, categories 변환 */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        if (cancelled) return;

        setSummary(res);
        setIsCard(!res?.cardConnected);

        // 카테고리 중복 제거
        const allCats: string[] = (res?.monthly ?? []).flatMap((m: any) =>
          (m.categories ?? []).map((c: any) => c.category as string),
        );
        const uniqueCats = Array.from(new Set(allCats));
        setCategories(uniqueCats);

        // Recharts용 데이터 변환
        const rows = (res?.monthly ?? []).map((m: any) => {
          const row: Record<string, number | string> = { month: monthLabel(m.month) };
          (m.categories ?? []).forEach((c: any) => {
            row[c.category] = c.totalAmount ?? 0;
          });
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

  /** 기본 선택 카테고리 지정 */
  useEffect(() => {
    if (!selected && categories.length > 0) setSelected(categories[0]);
  }, [categories, selected]);

  /** 🔹 카테고리별 색상 매핑 */
  const COLORS = useMemo(
    () =>
      Object.fromEntries(categories.map((c, i) => [c, COLOR_PALETTE[i % COLOR_PALETTE.length]])),
    [categories],
  );

  /** 현재/이전 달 데이터 */
  const curr = chartData[chartData.length - 1] ?? {};
  const prev = chartData[chartData.length - 2] ?? {};

  /** 이번 달 총합 */
  const currentTotal = useMemo(() => {
    const monthly = summary?.monthly ?? [];
    if (monthly.length > 0) {
      const last = monthly[monthly.length - 1];
      if (typeof last?.monthTotalAmount === 'number') return last.monthTotalAmount;
    }
    return categories.reduce((sum, k) => sum + (Number(curr?.[k]) || 0), 0);
  }, [summary, categories, curr]);

  /** 평균 / 절약 계산 */
  const metrics = useMemo(() => {
    const currMonthStr = (curr?.month as string) || '';
    const prevMonthStr = (prev?.month as string) || '';
    const currM = Number(currMonthStr.replace('월', '')) || 8;
    const prevM = Number(prevMonthStr.replace('월', '')) || 7;

    const currVal = (curr?.[selected] as number) ?? 0;
    const prevVal = (prev?.[selected] as number) ?? 0;

    const currAvg = currVal / (DAYS_BY_MONTH[currM - 1] || 30);
    const prevAvg = prevVal / (DAYS_BY_MONTH[prevM - 1] || 30);
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

  /** 🔹 막대 너비 비율 */
  const CHIP_MAX = 120;
  const [prevWidth, currWidth] = useMemo(() => {
    const prev = metrics.prevAvg;
    const curr = metrics.currAvg;
    if (prev === 0 && curr === 0) return [0, 0];
    if (prev >= curr) return [CHIP_MAX, (curr / prev) * CHIP_MAX];
    return [(prev / curr) * CHIP_MAX, CHIP_MAX];
  }, [metrics.prevAvg, metrics.currAvg]);

  return (
    <div>
      <Page>
        <MenuButton onClick={() => setIsMenuOpen(true)}>⋮</MenuButton>
        <h2 style={{ marginTop: '4rem', marginBottom: '0.5rem', color: 'white' }}>
          {username}님의 소비 분석
        </h2>
        {/* 로딩 상태 */}

        {loading && (
          <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
            <RandomSpinner />
          </div>
        )}
        {/* 에러 상태 */}
        {error && <div style={{ padding: 12, color: 'red' }}>{error}</div>}

        {/* 본문 */}
        {!loading && (
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

                <SpendingChart
                  data={chartData}
                  categories={categories}
                  COLORS={COLORS}
                  curr={curr}
                  prev={prev}
                  selected={selected}
                  setSelected={setSelected}
                />

                <CategoryPanel>
                  <div className="section-title">CATEGORY GOALS</div>
                  <div className="line1">
                    <span>{username}님이 선택한 카테고리:</span>
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

        <CardConnectModal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          onSuccess={fetchSummary}
        />
      </Page>
      <BottomNavigationBar />
      {isMenuOpen && (
        <>
          <Dim onClick={() => setIsMenuOpen(false)} />
          <BottomCenterModal>
            <ModalItem onClick={() => setIsConnectOpen(true)}>카드 변경</ModalItem>
            <ModalItem danger onClick={() => alert('카드 해지')}>
              카드 해지
            </ModalItem>
          </BottomCenterModal>
        </>
      )}
    </div>
  );
}
