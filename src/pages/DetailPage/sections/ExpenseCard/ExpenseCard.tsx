import { useEffect, useState } from 'react';
import { Plane, Home, Utensils, Check } from 'lucide-react';
import { PiAirplaneTiltFill } from 'react-icons/pi';
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
const BASE_URL = import.meta.env.VITE_API_URL as string;
export default function ExpenseCard({ savedPercent, tripId }: Props) {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('accessToken');

  // 여행 경비 항목 불러오기 함수 (PATCH 후에도 재사용)
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/trip-plans/${tripId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const data = await res.json();

      // fetchExpenses 안에서 매핑 부분 수정
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
          purchased: c.consumed ?? false,
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

  // 목표 달성 처리 (POST 요청 + 상태 업데이트)
  const handlePurchase = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const bodyData = {
        tripPlanId: tripId,
        categoryName: item.label,
        isConsumed: true,
      };
      const token = localStorage.getItem('accessToken');
      console.log('POST 요청 보낼 데이터:', bodyData);

      await fetch(`${BASE_URL}/trip-plans/isconsumed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      // 요청 성공 시 로컬 상태 업데이트
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, purchased: true } : it)));
    } catch (err) {
      console.error('Failed to mark as consumed', err);
    }
  };

  // 모달 저장 처리 (PATCH 요청 반영)
  // 모달 저장 처리 (PATCH 요청 반영)
  const handleSaveItems = async (updatedItems: ExpenseItem[]) => {
    try {
      const bodyData = {
        categoryDTOList: updatedItems.map((item) => ({
          tripPlanId: tripId, // ✅ 각 항목에 tripPlanId 포함
          categoryName: item.label,
          amount: item.amount,
        })),
      };

      console.log('PATCH 요청 보낼 데이터:', bodyData);

      await fetch(`${BASE_URL}/trip-plans/category`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },


      // 요청 후 로컬 업데이트
      setItems(updatedItems);
    } catch (err) {
      console.error('Failed to update expenses', err);
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
                        alignItems: 'center',
                        width: '90px',
                        justifyContent: 'space-around',
                        cursor: 'pointer',
                        display: 'flex',
                        fontSize: '0.8rem',
                        marginRight: '8px',
                      }}
                    >
                      <PiAirplaneTiltFill />
                      목표 달성
                    </button>
                  )}
                </div>
              </Item>

              <CheckMark $visible={covered || i.purchased}>
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
