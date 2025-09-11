import { useEffect, useState } from 'react';
import { Plane, Home, Utensils, Check } from 'lucide-react';
import { PiAirplaneTiltFill } from "react-icons/pi";
import EditModal from '../../../../components/common/EditModal';

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
  purchased?: boolean;
};

type Props = {
  savedPercent: number;
  tripId: number;
};


export default function ExpenseCard({ savedPercent, tripId }: Props) {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 여행 경비 항목 불러오기 함수 (PATCH 후에도 재사용)
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/trip-plans/${tripId}`, {
        method: 'GET',
        credentials: 'include', // ✅ 쿠키 포함
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

  // 첫 렌더링 시 데이터 가져오기
  useEffect(() => {
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

  // 목표 달성 처리
  const handlePurchase = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, purchased: true } : item))
    );
  };

  // 모달 저장 처리 (PATCH 요청 후 다시 GET)
  // 모달 저장 처리 (PATCH 요청 반영)
  const handleSaveItems = async (updatedItems: ExpenseItem[]) => {
    try {
      const bodyData = {
        planId: tripId,
        categoryDTOList: updatedItems.map((item) => ({
          categoryName: item.label,
          amount: item.amount,
        })),
      };

      console.log("PATCH 요청 보낼 데이터:", bodyData); // 🔥 여기서 확인

      await fetch(`http://localhost:8080/trip-plans/${tripId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      // 요청 후 로컬 업데이트
      setItems(updatedItems);
    } catch (err) {
      console.error("Failed to update expenses", err);
    }
  };


  return (
    <Wrapper>
      <Header>
        <div>
          <Title>예상 1인 경비</Title>
          <Amount>₩ {total.toLocaleString()}</Amount>
        </div>
        <EditBtn onClick={() => setIsModalOpen(true)}>수정하기</EditBtn>
      </Header>

      <ItemList>
        {items.map((i) => {
          const covered = coveredSet.has(i.id);

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

              <CheckMark $visible={covered}>
                <Check size={24} strokeWidth={6} />
              </CheckMark>
            </ItemContainer>
          );
        })}
      </ItemList>

      {isModalOpen && (
        <EditModal
          tripId={tripId}
          items={items}
          coveredSet={coveredSet}
          onSave={handleSaveItems}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Wrapper>
  );
}