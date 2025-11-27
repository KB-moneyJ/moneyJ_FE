import { LegendProps } from 'recharts';
import { LegendScroll, LegendWrapper } from '../SpendingPage.style';

interface Props extends LegendProps {
  categories: string[];
  COLORS: Record<string, string>;
  curr: Record<string, number>;
  prev: Record<string, number>;
  selected: string;
  setSelected: (k: string) => void;
}

export default function CategoryLegend({
  categories,
  COLORS,
  curr,
  prev,
  selected,
  setSelected,
}: Props) {
  return (
    <LegendScroll>
      <LegendWrapper>
        {categories.map((k) => {
          const currVal = (curr?.[k] ?? 0) as number;
          const prevVal = (prev?.[k] ?? 0) as number;
          const rate = ((currVal - prevVal) / Math.max(1, prevVal)) * 100;

          let pillClass = 'neutral';
          if (rate > 0) pillClass = 'down';
          else if (rate < 0) pillClass = 'up';

          return (
            <button
              key={k}
              type="button"
              className={`legend-item ${selected === k ? 'active' : ''}`}
              onClick={() => setSelected(k)}
            >
              <div className="row">
                <span className="dot" style={{ backgroundColor: COLORS[k] }} />
                <span className="label">{k}</span>
              </div>
              <div className="value">{currVal.toLocaleString('ko-KR')}</div>
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
