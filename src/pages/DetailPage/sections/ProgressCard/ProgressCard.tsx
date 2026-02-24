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
  CardLinkBtn,
  RefreshButton,
  UnlinkButton,
  ChangeButton,
  ActionButtonsRow,
  HeaderRow,
  BankName,
  AccountNumber,
  BalanceBig,
  BankInfoColumn,
} from './ProgressCard.style';
import { useCardStore } from '@/stores/useCardStore';
import { useNavigate } from 'react-router-dom';
import { manualAccountUpdate } from '@/api/accounts';
import { useQueryClient } from '@tanstack/react-query';
import { TRIP_KEYS } from '@/api/trips/queries';
import { useState } from 'react';

type Props = {
  progress: number;
  tip?: string;
  linked?: boolean;
  accountName?: string;
  accountNumber?: string;
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
  accountName,
  accountNumber,
  balance,
  accountId,
  tripId,
  onClickLink,
  onClickUnlink,
  onClickChangeAccount,
}: Props) {
  const isLinked = !!linked;
  const hasTip = typeof tip === 'string' && tip.trim().length > 0;
  const { cardConnected } = useCardStore();
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

  const maskAccount = (acc?: string) => {
    if (!acc) return '';
    // if simple number: 12341234
    if (acc.length < 6) return acc;
    // Show first 6, mask rest? User example: 735702-01-xxxxxx
    // Attempt to mask last 6 digits
    const len = acc.length;
    if (len > 6) {
      return acc.slice(0, len - 6) + 'x'.repeat(6);
    }
    return acc;
  };

  return (
    <Wrapper>
      {!isLinked ? (
        <>
          <Title>나의 진행 상황</Title>
          <SaveBtn onClick={onClickLink}>계좌 연동하기</SaveBtn>
        </>
      ) : (
        <>
          {/* Header: Bank Name + Refresh + Account Number */}
          <HeaderRow>
            <BankInfoColumn>
              <BankName>{accountName || '은행 정보 없음'}</BankName>
              <AccountNumber>{maskAccount(accountNumber)}</AccountNumber>
            </BankInfoColumn>
            <RefreshButton
              onClick={handleRefresh}
              disabled={isRefreshing || !accountId}
              $isRotating={isRefreshing}
              aria-label="잔액 새로고침"
            >
              <svg
                width="14"
                height="14"
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
          </HeaderRow>

          {/* Big Balance */}
          <BalanceBig>
            {typeof balance === 'number' ? `${balance.toLocaleString()}원` : '잔액 조회 실패'}
          </BalanceBig>

          {/* Action Buttons */}
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

      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
        <ProgressBar
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <ProgressFill $percent={progress} />
        </ProgressBar>
        <ProgressRightLabel>{(Math.round(progress * 10) / 10).toFixed(0)}%</ProgressRightLabel>
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
            <TipLabel>TIP</TipLabel>
            <TipText>계좌와 카드를 연동하면 여행 목표 금액에 도달할 수 있게  맞춤형 저축 팁을 드릴 수 있어요!</TipText>
          </Tip>
          {!cardConnected && (
            <CardLinkBtn
              style={{ marginTop: 10 }}
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
