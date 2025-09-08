import { useMemo, useState } from 'react';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import {
  Wrapper,
  TitleContainer,
  ChartContainer,
  LegendWrapper,
  CategoryPanel,
  SavingsBanner,
  CardButton,
  Text,
} from './SpendingPage.style';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LegendProps } from 'recharts';
import CardConnectModal from '@/components/modals/CardConnectModal';

type CatKey = '식비' | '교통비' | '카페';

const data = [
  { month: '3월', 식비: 1200, 교통비: 800, 카페: 300 },
  { month: '4월', 식비: 1500, 교통비: 1000, 카페: 500 },
  { month: '5월', 식비: 1300, 교통비: 900, 카페: 400 },
  { month: '6월', 식비: 1000, 교통비: 700, 카페: 300 },
  { month: '7월', 식비: 1600, 교통비: 1100, 카페: 600 },
  { month: '8월', 식비: 2000, 교통비: 500, 카페: 200 },
];

const COLORS: Record<CatKey, string> = {
  식비: '#F8D66D',
  교통비: '#E891F7',
  카페: '#6C63FF',
};

const monthDays: Record<string, number> = {
  '1월': 31,
  '2월': 28,
  '3월': 31,
  '4월': 30,
  '5월': 31,
  '6월': 30,
  '7월': 31,
  '8월': 31,
  '9월': 30,
  '10월': 31,
  '11월': 30,
  '12월': 31,
};

const toCurrency = (v: number) => v.toLocaleString('ko-KR');

const toK = (v: number) => {
  if (v >= 1000) {
    const x = Math.round(v / 100);
    return `${String(x).slice(0, -1)},${String(x).slice(-1)}K`;
  }
  return String(v);
};

export default function SpendingPage() {
  const [selected, setSelected] = useState<CatKey>('식비');
  const [isCard, setisCard] = useState(true);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const curr = data[data.length - 1];
  const prev = data[data.length - 2];

  const metrics = useMemo(() => {
    const currAvg = (curr?.[selected] ?? 0) / (monthDays[curr?.month ?? '8월'] || 30);
    const prevAvg = (prev?.[selected] ?? 0) / (monthDays[prev?.month ?? '7월'] || 30);
    const diff = currAvg - prevAvg;
    return {
      currMonth: curr?.month ?? '',
      prevMonth: prev?.month ?? '',
      currAvg,
      prevAvg,
      diff,
      isSaving: diff < 0,
      savingAbs: Math.abs(diff),
    };
  }, [selected]);

  const CHIP_MAX = 120;

  const prevWidth = useMemo(() => {
    const max = Math.max(metrics.prevAvg, metrics.currAvg, 1);
    return (metrics.prevAvg / max) * CHIP_MAX;
  }, [metrics.prevAvg, metrics.currAvg]);

  const currWidth = useMemo(() => {
    const max = Math.max(metrics.prevAvg, metrics.currAvg, 1);
    return (metrics.currAvg / max) * CHIP_MAX;
  }, [metrics.prevAvg, metrics.currAvg]);

  function CustomLegend(_: LegendProps) {
    const items: CatKey[] = ['식비', '교통비', '카페'];
    return (
      <LegendWrapper>
        {items.map((k) => {
          const rate = (((curr?.[k] ?? 0) - (prev?.[k] ?? 0)) / Math.max(1, prev?.[k] ?? 0)) * 100;

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
                <span className="dot" style={{ backgroundColor: COLORS[k] }} />
                <span className="label">{k}</span>
              </div>
              <div className="value">{toK(curr?.[k] ?? 0)}</div>
              <div className={`pill ${pillClass}`}>
                {rate > 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`}
              </div>
            </button>
          );
        })}
      </LegendWrapper>
    );
  }

  return (
    <div>
      <TitleContainer>
        <div>CONSUMPTION ANALYSIS</div>
      </TitleContainer>
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
          <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} barCategoryGap="30%">
                <XAxis dataKey="month" />

                <Legend verticalAlign="bottom" align="center" content={<CustomLegend />} />
                <Bar dataKey="식비" stackId="a" fill={COLORS['식비']} />
                <Bar dataKey="교통비" stackId="a" fill={COLORS['교통비']} />
                <Bar dataKey="카페" stackId="a" fill={COLORS['카페']} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <CategoryPanel>
            <div className="section-title">CATEGORY GOALS</div>
            <div className="line1">
              <span>경서님이 선택한 카테고리:</span>
              <span className="chip" style={{ background: COLORS[selected] }}>
                {selected}
              </span>
            </div>
            <div className="helper">한 달 동안 하루 평균 이렇게 썼어요!</div>

            <div className="row">
              <span className="month">{metrics.prevMonth}</span>
              <span
                className="color-chip"
                style={{ background: COLORS[selected], width: `${prevWidth}px` }}
              />
              <span className="amount">{toCurrency(Math.round(metrics.prevAvg))} 원</span>
            </div>

            <div className="row current">
              <span className="month">{metrics.currMonth}</span>
              <span
                className="color-chip"
                style={{ background: COLORS[selected], width: `${currWidth}px` }}
              />
              <span className="amount current">{toCurrency(Math.round(metrics.currAvg))} 원</span>
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
      <CardConnectModal isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      <BottomNavigationBar />
    </div>
  );
}
