import React, { useEffect, useState } from 'react';
import { CARD_COMPANIES } from '@/constants/cards';
import {
  Overlay,
  ModalContainer,
  Title,
  FieldWrapper,
  Label,
  Input,
  Select,
  ConfirmButton,
  CloseButton,
} from './BankConnectModal.style';
import { connectCard } from '@/api/spending/spending';
import { RandomSpinner } from '@/pages/StartPlan/steps/StepsStyle'; // 경로 확인해서 필요 시 수정하세요

interface CardConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CardConnectModal({ isOpen, onClose }: CardConnectModalProps) {
  const [cardCompany, setCardCompany] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCardCompany('');
      setBankId('');
      setPassword('');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!cardCompany || !bankId.trim() || !password.trim()) {
      alert('카드사, 아이디, 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await connectCard(cardCompany, bankId, password);
      alert('카드 연결에 성공했습니다.');
      window.location.reload();

      onClose(); // 모달 닫기
    } catch (err: any) {
      console.error('카드 연결 에러', err);
      alert('카드 연결에 실패했습니다. ' + (err?.message ?? '다시 시도해주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={() => { if (!isSubmitting) onClose(); }}>
      <ModalContainer onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <CloseButton onClick={() => { if (!isSubmitting) onClose(); }} />
        <Title>어떤 카드와 연결할까요?</Title>

        <FieldWrapper>
          <Label htmlFor="card">카드사 선택</Label>
          <Select
            id="card"
            value={cardCompany}
            onChange={(e) => setCardCompany(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">카드사 선택</option>
            {CARD_COMPANIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="cardId">카드사 아이디 입력</Label>
          <Input
            id="cardId"
            type="text"
            placeholder="아이디 입력"
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="cardPw">카드사 비밀번호 입력</Label>
          <Input
            id="cardPw"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <ConfirmButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '연결 중...' : '확인'}
        </ConfirmButton>

        {/* 제출 중 오버레이 + Spinner */}
        {isSubmitting && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color:'white',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.75)',
              borderRadius: '8px',
              zIndex: 999,
            }}
          >
            <div style={{marginBottom:'80px'}}>최대 5분정도 소요됩니다...</div>
            <RandomSpinner />
          </div>
        )}
      </ModalContainer>
    </Overlay>
  );
}
