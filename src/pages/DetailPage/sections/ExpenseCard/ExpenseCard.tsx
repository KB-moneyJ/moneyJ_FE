import { useMemo, useState } from 'react';
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
  categories?: { name: string; amount: number; consumed?: boolean }[];
  onDataChange?: () => void;
};

const BASE_URL = import.meta.env.VITE_API_URL as string;
export default function ExpenseCard({
  savedPercent,
  tripId,
  categories = [],
  onDataChange,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('accessToken');

  // categories를 ExpenseItem 형식으로 변환
  const items = useMemo<ExpenseItem[]>(() => {
    return categories.map((c) => {
      let icon;
      switch (c.name) {
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
        id: c.name,
        label: c.name,
        amount: c.amount,
        icon,
        purchased: c.consumed ?? false,
      };
    });
  }, [categories]);

  // 총합 & 진행률 기반 커버 계산 (부모 progress 사용)
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

  // 목표 달성 처리 (POST 요청 + 상태 업데이트 + 진행률 증분 전달)
  const handlePurchase = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      if (item.purchased) return; // ✅ 중복 클릭 방지
      if (total <= 0) return; // ✅ 0 나눗셈 방지

      const bodyData = {
        tripPlanId: tripId,
        categoryName: item.label,
        isConsumed: true,
      };
      const token = localStorage.getItem('accessToken');
      console.log('POST 요청 보낼 데이터:', bodyData);

      await fetch(`${BASE_URL}/trip-plans/isconsumed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },

        body: JSON.stringify(bodyData),
      });

      // 부모 컴포넌트에 데이터 새로고침 요청
      onDataChange?.();
    } catch (err) {
      console.error('Failed to mark as consumed', err);
    }
  };

  const handleSaveItems = async (updatedItems: ExpenseItem[]) => {
    try {
      const bodyData = {
        categoryDTOList: updatedItems.map((item) => ({
          tripPlanId: tripId,
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
        body: JSON.stringify(bodyData),
      });

      // 부모 컴포넌트에 데이터 새로고침 요청
      onDataChange?.();
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
