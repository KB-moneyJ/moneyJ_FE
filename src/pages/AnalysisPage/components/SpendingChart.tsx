import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CategoryLegend from './CategoryLengend';
import styled from 'styled-components';

interface SpendingChartProps {
  data: any[];
  categories: string[];
  COLORS: Record<string, string>;
  curr: Record<string, number>;
  prev: Record<string, number>;
  selected: string;
  setSelected: (k: string) => void;
}

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;

  /* 클릭/탭 시 차트 포커싱 outline 제거 */
  .recharts-wrapper:focus,
  .recharts-wrapper *:focus,
  .recharts-surface:focus,
  .recharts-bar-rectangle path:focus {
    outline: none !important;
  }

  /* 모바일 탭 하이라이트 제거 */
  .recharts-wrapper svg {
    -webkit-tap-highlight-color: transparent;
  }
`;

export default function SpendingChart({
  data,
  categories,
  COLORS,
  curr,
  prev,
  selected,
  setSelected,
}: SpendingChartProps) {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="25%" tabIndex={-1}>
          <XAxis dataKey="month" />
          <Tooltip
            formatter={(v) => `${Number(v).toLocaleString('ko-KR')} 원`}
            contentStyle={{
              background: 'rgba(30, 30, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              backdropFilter: 'blur(15px)',
            }}
            labelStyle={{ fontWeight: 700, color: '#fff' }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            content={
              <CategoryLegend
                categories={categories}
                COLORS={COLORS}
                curr={curr}
                prev={prev}
                selected={selected}
                setSelected={setSelected}
              />
            }
          />
          {categories.map((k) => (
            <Bar key={k} dataKey={k} stackId="a" fill={COLORS[k] || '#8884d8'} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
