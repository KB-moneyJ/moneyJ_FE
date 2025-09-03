import { Plane, Home, Utensils, Check } from 'lucide-react';
import {
  Wrapper,
  Header,
  Title,
  Amount,
  EditBtn,
  ItemList,
  Item,
  Label,
  Price,
  CheckMark,
} from './ExpenseCard.style';

type ExpenseItem = {
  id: string;
  label: string;
  amount: number;
  icon: React.ReactNode;
};

type Props = {
  savedPercent: number;
};

// TODO: API 연동
const baseItems: ExpenseItem[] = [
  { id: 'flight', label: '항공권', amount: 800000, icon: <Plane size={18} /> },
  { id: 'hotel', label: '숙박', amount: 1000000, icon: <Home size={18} /> },
  { id: 'food', label: '식비', amount: 400000, icon: <Utensils size={18} /> },
];

export default function ExpenseCard({ savedPercent }: Props) {
  const items = baseItems;
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
      <Header>
        <div>
          <Title>예상 1인 경비</Title>
          <Amount>₩ {total.toLocaleString()}</Amount>
        </div>
        <EditBtn>수정하기</EditBtn>
      </Header>

      <ItemList>
        {items.map((i) => {
          const covered = coveredSet.has(i.id);
          return (
            <Item key={i.id} $covered={covered}>
              <Label>
                {i.icon}
                {i.label}
              </Label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Price>₩{i.amount.toLocaleString()}</Price>
                {covered && (
                  <CheckMark>
                    <Check size={18} strokeWidth={2.5} />
                  </CheckMark>
                )}
              </div>
            </Item>
          );
        })}
      </ItemList>
    </Wrapper>
  );
}
