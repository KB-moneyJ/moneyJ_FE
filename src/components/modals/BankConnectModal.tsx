// src/components/modals/BankConnectModal.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
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
import ConfirmModal from '@/components/modals/ConfirmModal';

const BASE_URL = import.meta.env.VITE_API_URL as string;

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: (bankCode: string, accountNumber: string) => void;
  tripPlanId: number;
}

export default function BankConnectModal({
  isOpen,
  onClose,
  onConnected,
  tripPlanId,
}: BankConnectModalProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<{
    accountName: string;
    accountNumberDisplay: string;
    balance: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) window.scrollTo({ top: 0, behavior: 'auto' });
    if (!isOpen) {
      setAccountNumber('');
      setBank('');
      setBankId('');
      setPassword('');
      setSubmitting(false);
      setErrorMsg(null);
      setConfirmOpen(false);
      setConfirmPayload(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const disabled =
    submitting || !bank || !accountNumber.trim() || !bankId.trim() || !password.trim();

  const createConnectedIdBK = async (organization: string, id: string, pw: string) => {
    return axios.post(
      `${BASE_URL}/api/codef/connected-id`,
      {
        accountList: [
          {
            countryCode: 'KR',
            businessType: 'BK',
            clientType: 'P',
            organization,
            loginType: '1',
            id,
            password: pw,
          },
        ],
      },
      { withCredentials: true },
    );
  };

  const addCredentialBK = async (organization: string, id: string, pw: string) => {
    return axios.post(
      `${BASE_URL}/api/codef/credentials`,
      {
        countryCode: 'KR',
        businessType: 'BK',
        clientType: 'P',
        organization,
        loginType: '1',
        id,
        password: pw,
      },
      { withCredentials: true },
    );
  };

  const linkTripAccount = async (organizationCode: string, acctNo: string, planId: number) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/codef/accounts/bank`,
      {
        organizationCode,
        accountNumber: acctNo,
        tripPlanId: planId,
      },
      { withCredentials: true },
    );
    return data as { accountName: string; accountNumberDisplay: string; balance: number };
  };

  const handleSubmit = async () => {
    if (disabled) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      try {
        await createConnectedIdBK(bank, bankId, password);
      } catch {
        await addCredentialBK(bank, bankId, password);
      }

      const saved = await linkTripAccount(bank, accountNumber.trim(), tripPlanId);

      setConfirmPayload(saved);
      setConfirmOpen(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '계좌 연동에 실패했습니다. 정보를 다시 확인해 주세요.';
      setErrorMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCloseAll = () => {
    setConfirmOpen(false);
    if (onConnected) onConnected(bank, accountNumber.trim());
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
            autoComplete="off"
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
            autoComplete="username"
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
            autoComplete="current-password"
          />
        </FieldWrapper>

        {errorMsg && <p style={{ color: '#ff6868', fontSize: 13, marginTop: 4 }}>{errorMsg}</p>}

        <ConfirmButton onClick={handleSubmit} disabled={disabled}>
          {submitting ? '연결 중…' : '확인'}
        </ConfirmButton>

        <ConfirmModal
          open={confirmOpen}
          title="계좌 연결 완료"
          description={
            confirmPayload ? (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{confirmPayload.accountName}</div>
                <div style={{ opacity: 0.9, marginBottom: 4 }}>
                  계좌번호: {confirmPayload.accountNumberDisplay}
                </div>
                <div style={{ opacity: 0.9 }}>
                  현재 잔액: {confirmPayload.balance.toLocaleString()}원
                </div>
              </div>
            ) : (
              '계좌가 성공적으로 연결되었습니다.'
            )
          }
          confirmText="닫기"
          onConfirm={handleConfirmCloseAll}
        />
      </ModalContainer>
    </Overlay>
  );
}
