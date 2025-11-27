import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrapper,
  TitleBadge,
  TitleDestination,
  RateInfo,
  InputRow,
  InputField,
  CurrencyLabel,
  EqualSign,
  ResultValue,
  UpdateText,
} from './ExchangeRateCard.style';
import { useExchangeRate } from '@/api/exchange/useExcahngeRate';
/**
 * useDebounce Hook
 * - 입력값 변경이 발생할 때마다 지정된 시간(delay) 이후에만 실제 값 반영
 * - 짧은 시간 내 다수의 입력 이벤트 발생 시 마지막 입력만 반영됨
 *
 * [성능 개선 효과]
 * 1. 입력 도중 불필요한 계산 방지
 * 2. API 호출 또는 연산 빈도 감소
 */
function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const currencyMap: Record<string, string> = {
  Japan: 'JPY',
  USA: 'USD',
  Vietnam: 'VND',
  Thailand: 'THB',
  Philippines: 'PHP',
  China: 'CNY',
  Europe: 'EUR',
  'Czech Republic': 'CZK',
  'United Kingdom': 'GBP',
  Switzerland: 'CHF',
  Australia: 'AUD',
  Canada: 'CAD',
  Singapore: 'SGD',
  Malaysia: 'MYR',
  Indonesia: 'IDR',
  India: 'INR',
};

export default function ExchangeRateCard({ destination }: { destination: string }) {
  const parts = destination.split(',').map((s) => s.trim());
  const country = parts.length > 1 ? parts[1] : parts[0];
  const targetCurrency = currencyMap[country];

  const [amount, setAmount] = useState('');

  if (!targetCurrency) {
    return (
      <Wrapper>
        <TitleBadge>Exchange Rate</TitleBadge>
        <TitleDestination>{destination}</TitleDestination>
        <p>{country}에 대한 통화 코드를 찾을 수 없습니다.</p>
      </Wrapper>
    );
  }

  const { data, isLoading, isError } = useExchangeRate(targetCurrency, 'KRW');
  const debouncedAmount = useDebounce(amount, 300);
  /**
   * useMemo
   * - 동일한 입력값(debouncedAmount)과 환율 데이터(data)가 유지되는 동안
   *   이전 계산 결과를 메모이징하여 재계산 방지.
   */
  const converted = useMemo(() => {
    if (!data || !debouncedAmount) return null;
    const result = parseFloat(debouncedAmount) * data.rate;
    return isNaN(result) ? null : result;
  }, [debouncedAmount, data]);

  return (
    <Wrapper>
      <TitleBadge>Exchange Rate</TitleBadge>
      <TitleDestination>{country}</TitleDestination>

      {isLoading && <p>환율 불러오는 중...</p>}
      {isError && <p>환율 정보를 불러오지 못했습니다.</p>}

      {data && (
        <>
          <RateInfo>
            1 {data.base} = {data.rate.toLocaleString()} {data.target}
          </RateInfo>

          <InputRow>
            <InputField
              type="number"
              placeholder={`${data.base} 금액 입력`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <CurrencyLabel>{data.base}</CurrencyLabel>
            <EqualSign>=</EqualSign>
            <ResultValue>{converted !== null ? converted.toLocaleString() : '0'}</ResultValue>
            <CurrencyLabel>{data.target}</CurrencyLabel>
          </InputRow>

          <UpdateText>업데이트: {new Date(data.lastUpdate).toLocaleString()}</UpdateText>
        </>
      )}
    </Wrapper>
  );
}
