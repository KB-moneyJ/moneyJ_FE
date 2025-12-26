import { CircleDollarSign } from 'lucide-react';
import { useState } from 'react';
import {
  Wrapper,
  SaveBtn,
  Title,
  ProgressBar,
  ProgressFill,
  ProgressRightLabel,
  Divider,
  Tip,
  TipLabel,
  TipText,
  AccountText,
  CardLinkBtn,
  BalancePill,
  AccountRow,
  RefreshButton,
  UnlinkButton,
  ChangeButton,
  ActionButtonsRow,
} from './ProgressCard.style';
import { useCardStore } from '@/stores/useCardStore';
import { useNavigate } from 'react-router-dom';
import { manualAccountUpdate } from '@/api/accounts';
import { useQueryClient } from '@tanstack/react-query';
import { TRIP_KEYS } from '@/api/trips/queries';

type Props = {
  progress: number;
  tip?: string;
  linked?: boolean;
  accountLabel?: string;
  balance?: number;
  accountId?: number;
  tripId?: string;
  onClickSave?: () => void;
  onClickLink?: () => void;
  onClickUnlink?: () => void;
  onClickChangeAccount?: () => void;
};

export default function ProgressCard({
  progress,
  tip,
  linked,
  accountLabel,
  balance,
  accountId,
  tripId,
  onClickSave,
  onClickLink,
  onClickUnlink,
  onClickChangeAccount,
}: Props) {
  const isLinked = !!linked;
  const hasTip = typeof tip === 'string' && tip.trim().length > 0;
  const { cardConnected, setCardConnected } = useCardStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!accountId || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await manualAccountUpdate(accountId);
      // 잔액 업데이트 후 쿼리 refetch
      if (tripId) {
        await qc.refetchQueries({
          queryKey: TRIP_KEYS.balances(tripId),
          exact: true,
        });
        await qc.refetchQueries({
          queryKey: TRIP_KEYS.detail(tripId),
          exact: true,
        });
      }
    } catch (error) {
      console.error('계좌 업데이트 실패:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Wrapper>
      <Title>나의 진행 상황</Title>
      {!isLinked && <SaveBtn onClick={onClickLink}>계좌 연동하기</SaveBtn>}
      {isLinked && (
        <>
          <AccountRow>
            {accountLabel && <AccountText>{accountLabel}</AccountText>}
            {typeof balance === 'number' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BalancePill aria-label="모은 잔액">
                  <CircleDollarSign size={14} style={{ marginRight: 4 }} />
                  모은 잔액 {balance.toLocaleString()}원
                </BalancePill>
                <RefreshButton
                  onClick={handleRefresh}
                  disabled={isRefreshing || !accountId}
                  $isRotating={isRefreshing}
                  aria-label="계좌 잔액 새로고침"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    <path d="M17 8h4v4" />
                  </svg>
                </RefreshButton>
              </div>
            )}
          </AccountRow>
          <ActionButtonsRow>
            {onClickChangeAccount && (
              <ChangeButton onClick={onClickChangeAccount} disabled={!accountId}>
                계좌 변경
              </ChangeButton>
            )}
            {onClickUnlink && (
              <UnlinkButton onClick={onClickUnlink} disabled={!accountId}>
                계좌 연동 해제
              </UnlinkButton>
            )}
          </ActionButtonsRow>
        </>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProgressBar
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={progress} />
        </ProgressBar>
        <ProgressRightLabel>{(Math.round(progress * 10) / 10).toFixed(1)}%</ProgressRightLabel>
      </div>

      <Divider />

      {hasTip ? (
        <Tip>
          <TipLabel>TIP</TipLabel>
          <TipText>{tip}</TipText>
        </Tip>
      ) : (
        <>
          <Tip>
            <TipLabel>저축 TIP이 궁금하다면?</TipLabel>
          </Tip>
          {cardConnected ? (
            <CardLinkBtn>이제 계좌만 연동하면 돼요!</CardLinkBtn>
          ) : (
            <CardLinkBtn
              onClick={() => {
                navigate('/spending');
              }}
            >
              카드 연결하기
            </CardLinkBtn>
          )}
        </>
      )}
    </Wrapper>
  );
}
