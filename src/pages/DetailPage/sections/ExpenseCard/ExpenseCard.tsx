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
  GoalButton,
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
  accountBalance?: number;
  totalBudget?: number;
  categories?: { name: string; amount: number; consumed?: boolean }[];
  onDataChange?: () => void;
};

const BASE_URL = import.meta.env.VITE_API_URL as string;
export default function ExpenseCard({
  savedPercent,
  tripId,
  accountBalance,
  totalBudget,
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

  // 총합 & 실제 계좌 잔액 기반 커버 계산
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  
  // 실제 계좌 잔액이 있으면 그것을 사용, 없으면 진행률 기반으로 계산
  const actualBalance = typeof accountBalance === 'number' && accountBalance >= 0 
    ? accountBalance 
    : (typeof totalBudget === 'number' && totalBudget > 0 
      ? Math.round((totalBudget * savedPercent) / 100) 
      : 0);

  const coveredSet = useMemo(() => {
    const set = new Set<string>();
    let remaining = actualBalance;
    
    // 이미 구매한 항목은 제외하고 계산
    const unpurchasedItems = items.filter(i => !i.purchased);
    
    for (const i of unpurchasedItems) {
      if (remaining >= i.amount) {
        set.add(i.id);
        remaining -= i.amount;
      } else {
        break;
      }
    }
    
    return set;
  }, [items, actualBalance]);

  // 목표 달성 처리 (POST 요청 + 상태 업데이트)
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const handlePurchase = async (id: string) => {
    // 이미 처리 중이면 중복 요청 방지
    if (processingId) return;
    
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      if (item.purchased) return; // 중복 클릭 방지

      setProcessingId(id);

      const bodyData = {
        tripPlanId: tripId,
        categoryName: item.label,
        isConsumed: true,
      };
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${BASE_URL}/trip-plans/isconsumed`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const responseData = await response.json();

      // 서버가 consumed 값을 반환하는지 확인
      if (responseData.consumed === true) {
        // 성공적으로 처리되었으므로 데이터 새로고침
        if (onDataChange) {
          await onDataChange();
        }
      } else {
        // consumed가 false이거나 undefined인 경우 실패로 간주
        const errorMsg = responseData.message || '알 수 없는 오류';
        alert(`목표 달성 처리에 실패했습니다.\n\n${errorMsg}`);
        setProcessingId(null);
        return;
      }
    } catch (err) {
      alert('목표 달성 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setProcessingId(null);
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
      // 에러 처리
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
                  {!i.purchased && (
                    <GoalButton 
                      onClick={() => handlePurchase(i.id)} 
                      $blink={covered}
                      disabled={processingId === i.id}
                      style={{ opacity: processingId === i.id ? 0.6 : 1, cursor: processingId === i.id ? 'wait' : 'pointer' }}
                    >
                      <PiAirplaneTiltFill />
                      {processingId === i.id ? '처리 중...' : '목표 달성'}
                    </GoalButton>
                  )}
                </div>
              </Item>

              <CheckMark $visible={i.purchased}>
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
