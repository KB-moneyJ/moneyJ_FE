import { useState } from 'react';
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

// TODO: API 연동
const items: ExpenseItem[] = [
  { id: 'flight', label: '항공권', amount: 800000, icon: <Plane size={18} /> },
  { id: 'hotel', label: '숙박', amount: 1000000, icon: <Home size={18} /> },
  { id: 'food', label: '식비', amount: 400000, icon: <Utensils size={18} /> },
];

export default function ExpenseCard() {
  const [selected, setSelected] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + i.amount, 0);

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
        {items.map((i) => (
          <Item key={i.id} $selected={selected === i.id} onClick={() => setSelected(i.id)}>
            <Label>
              {i.icon}
              {i.label}
            </Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Price>₩{i.amount.toLocaleString()}</Price>
              {selected === i.id && (
                <CheckMark>
                  <Check size={18} />
                </CheckMark>
              )}
            </div>
          </Item>
        ))}
      </ItemList>
    </Wrapper>
  );
}
