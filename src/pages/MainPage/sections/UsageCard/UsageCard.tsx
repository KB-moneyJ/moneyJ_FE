import { useState } from 'react';
import {
  UsageCardContainer,
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

type Category = {
  name: string;
  percent: number;
  color: string;
  amount: number;
};

const categories: Category[] = [
  { name: '카페', percent: 0.3, color: '#ff6b8b', amount: 309300 },
  { name: '식비', percent: 0.2, color: '#ffb84d', amount: 206200 },
  { name: '쇼핑', percent: 0.2, color: '#ffcf33', amount: 206200 },
  { name: '구독', percent: 0.15, color: '#3ddc5a', amount: 154650 },
  { name: '기타', percent: 0.15, color: '#c9c9c9', amount: 154650 },
];

export default function UsageCard() {
  const [hovered, setHovered] = useState<Category | null>(null);

  return (
    <UsageCardContainer>
      <Header>
        <Caption>8월 사용 금액</Caption>
        <Amount>1,031,000원</Amount>
      </Header>

      <Bar>
        {categories.map((cat, i) => (
          <Seg
            key={i}
            style={{ flex: cat.percent, backgroundColor: cat.color }}
            onMouseEnter={() => setHovered(cat)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </Bar>

      {hovered && (
        <Tooltip>
          {hovered.name}: {hovered.amount.toLocaleString()}원 ({Math.round(hovered.percent * 100)}%)
        </Tooltip>
      )}

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
        <TipText>"하루 커피 한 잔을 줄이면 항공권 목표 달성 시기가 3개월 빨라집니다."</TipText>
      </Tip>
    </UsageCardContainer>
  );
}
