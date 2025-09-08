import { useEffect, useState } from 'react';
import { BANKS } from '@/constants/banks';
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

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankConnectModal({ isOpen, onClose }: BankConnectModalProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({ accountNumber, bank, bankId, password });
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <Title>어떤 계좌와 연결할까요?</Title>

        <FieldWrapper>
          <Label htmlFor="account">계좌번호 입력</Label>
          <Input
            id="account"
            type="text"
            placeholder="계좌번호 입력"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="bank">은행 선택</Label>
          <Select id="bank" value={bank} onChange={(e) => setBank(e.target.value)}>
            <option value="">은행 선택</option>
            {BANKS.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="bankId">은행사 아이디 입력</Label>
          <Input
            id="bankId"
            type="text"
            placeholder="아이디 입력"
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="password">은행사 비밀번호 입력</Label>
          <Input
            id="password"
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
