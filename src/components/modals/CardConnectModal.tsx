import { useEffect, useState } from 'react';
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
import { set } from '@vueuse/core';
import { connectCard } from '@/api/spending/spending';
interface CardConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CardConnectModal({ isOpen, onClose }: CardConnectModalProps) {
  const [cardCompany, setCardCompany] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCardCompany('');
      setBankId('');
      setPassword('');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({ cardCompany, bankId, password });
    connectCard(cardCompany, bankId, password);
    setCardCompany('');
    setBankId('');
    setPassword('');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <Title>어떤 카드와 연결할까요?</Title>
        <FieldWrapper>
          <Label htmlFor="card">카드사 선택</Label>
          <Select id="card" value={cardCompany} onChange={(e) => setCardCompany(e.target.value)}>
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
          />
        </FieldWrapper>

        <ConfirmButton onClick={handleSubmit}>확인</ConfirmButton>
      </ModalContainer>
    </Overlay>
  );
}
