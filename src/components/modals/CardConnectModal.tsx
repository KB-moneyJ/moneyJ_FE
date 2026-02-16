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
import { connectCard, linkCard, saveTransactions } from '@/api/spending/spending';
import { RandomSpinner } from '@/pages/StartPlan/steps/StepsStyle';

interface CardConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CardConnectModal({ isOpen, onClose, onSuccess }: CardConnectModalProps) {
  const [cardCompany, setCardCompany] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카드 목록 & 선택값
  const [cards, setCards] = useState<any[]>([]); // CardConnectResponse
  const [selectedCard, setSelectedCard] = useState<string>(''); // cardNo

  useEffect(() => {
    if (isOpen) {
      setCardCompany('');
      setBankId('');
      setPassword('');
      setIsSubmitting(false);
      setCards([]);
      setSelectedCard('');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canFetch = !!cardCompany && !!bankId.trim() && !!password.trim();
  const canSubmit = !!selectedCard && !!cardCompany && !isSubmitting;


  // 1) 카드 연결 및 목록 조회
  const handleFetchCards = async () => {
    if (!canFetch) return;
    setIsSubmitting(true);
    setCards([]);
    try {
      // import { connectCard } from '@/api/spending/spending';
      const list = await connectCard(cardCompany, bankId, password);
      if (!list || list.length === 0) {
        alert('조회된 카드가 없습니다.');
        return;
      }
      setCards(list);
    } catch (err: any) {
      console.error('카드 연결 에러', err);
      alert('카드 연결에 실패했습니다. ' + (err?.message ?? '다시 시도해주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2) 카드 Link
  const handleSubmit = async () => {
    if (!canSubmit) return;

    const target = cards.find(c => c.cardNo === selectedCard);
    if (!target) return;

    setIsSubmitting(true);
    try {
      // import { linkCard } from '@/api/spending/spending'; (Needs export in API file)
      // Actually connectCard in spending.ts was exported, linkCard needs to be added/exported.
      // Assuming linkCard exists or I will add it.
      // Re-checking spending.ts... I added linkCard in previous step.

      // We need to import linkCard.
      await linkCard({
        cardName: target.cardName,
        cardNo: target.cardNo,
        organizationCode: cardCompany
      });

      // 트랜잭션 저장 API 호출 (복구)
      try {
        await saveTransactions({
          cardName: target.cardName,
          cardNo: target.cardNo,
          organizationCode: cardCompany,
          cardPassword: password, // Pass the password entered by user
          // birthDate: '...' // If user info available, pass it here
        });
      } catch (e) {
        console.error('내역 저장 실패 (무시됨):', e);
      }

      alert('카드 연결에 성공했습니다.');
      onSuccess?.();
      onClose();
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

        <ConfirmButton onClick={handleFetchCards} disabled={!canFetch || isSubmitting}>
          {isSubmitting ? '카드 조회 중...' : '카드 불러오기'}
        </ConfirmButton>

        {cards.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>카드 선택</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cards.map((c) => (
                <li key={c.cardNo} style={{ marginBottom: 8 }}>
                  <label
                    style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="card"
                      value={c.cardNo}
                      checked={selectedCard === c.cardNo}
                      onChange={() => setSelectedCard(c.cardNo)}
                    />
                    <span>
                      {c.cardName} ({c.cardNo})
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <ConfirmButton onClick={handleSubmit} disabled={!canSubmit}>
              {isSubmitting ? '연결 중...' : '확인'}
            </ConfirmButton>
          </div>
        )}

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
              color: 'white',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.75)',
              borderRadius: '8px',
              zIndex: 999,
            }}
          >
            <div style={{ marginBottom: '80px' }}>최대 5분정도 소요됩니다...</div>
            <RandomSpinner />
          </div>
        )}
      </ModalContainer>
    </Overlay>
  );
}
