import { useEffect, useState } from 'react';
import { Plane, Home, Utensils, Check } from 'lucide-react';
import { PiAirplaneTiltFill } from "react-icons/pi";


import {
  Wrapper,
  Header,
  Title,
  Amount,
  EditBtn,
  ItemList,
  Item,
  CheckMark,
  ItemContainer,
} from './ExpenseCard.style';
import { Label, Price } from '@/pages/StartPlan/PlanCard/PlanCardStyle';

type ExpenseItem = {
  id: string;
  label: string;
  amount: number;
  icon: React.ReactNode;
  purchased?: boolean; // 사용자가 직접 '목표 달성'한 상태
};

type Props = {
  savedPercent: number; // 진행률 (%)
  tripId: number;
};

export default function ExpenseCard({ savedPercent, tripId }: Props) {
  const [items, setItems] = useState<ExpenseItem[]>([]);

  // 여행 경비 항목 불러오기
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(`http://localhost:8080/trip-plans/${tripId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        const mappedItems: ExpenseItem[] = data.categoryDTOList.map((c: any) => {
          let icon;
          switch (c.categoryName) {
            case '항공비':
              icon = <Plane size={18} />;
              break;
            case '숙박':
              icon = <Home size={18} />;
              break;
            case '식비':
              icon = <Utensils size={18} />;
              break;
            default:
              icon = <Check size={18} />;
          }

          return {
            id: c.categoryName,
            label: c.categoryName,
            amount: c.amount,
            icon,
            purchased: false,
          };
        });

        setItems(mappedItems);
      } catch (err) {
        console.error('Failed to fetch expenses', err);
      }
    };

    fetchExpenses();
  }, [tripId]);

  // 총합 & 진행률 기반 커버 계산
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

  // 사용자가 직접 "목표 달성" 처리
  const handlePurchase = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, purchased: true } : item))
    );
  };

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
          const covered = coveredSet.has(i.id); // 진행률 기반 자동 체크만

          return (
            <ItemContainer key={i.id}>
              <Item $covered={covered} $purchased={i.purchased}>
                <Label>
                  {i.icon}
                  {i.label}
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Price>₩{i.amount.toLocaleString()}</Price>
                  {!covered && !i.purchased && (
                    <button
                      onClick={() => handlePurchase(i.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        border: '1px solid #ffeaa6',
                        background: '#fffea6',
                        alignItems:'center',
                        width:'90px',
                        justifyContent:'space-around',
                        cursor: 'pointer',
                        display:'flex',
                        fontSize: '0.8rem',
                        marginRight:'8px'
                      }}
                    >
                      <PiAirplaneTiltFill />
                      목표 달성
                    </button>
                  )}
                </div>
              </Item>

              {/* 체크마크는 자동 진행률 기반만 */}
              <CheckMark $visible={covered}>
                <Check size={24} strokeWidth={6} />
              </CheckMark>
            </ItemContainer>
          );
        })}
      </ItemList>
    </Wrapper>
  );
}
