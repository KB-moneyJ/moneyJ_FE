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

const BASE_URL = import.meta.env.VITE_API_URL as string;

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 연동 성공 시 부모에 알림 (은행코드, resAccount) */
  onConnected?: (bankCode: string, accountNumber: string) => void;
  tripPlanId: number;
}

type DepositTrustAccount = {
  resAccount: string;
  resAccountDisplay: string;
  resAccountName: string;
  resAccountBalance: string;
};

export default function BankConnectModal({
  isOpen,
  onClose,
  onConnected,
  tripPlanId,
}: BankConnectModalProps) {
  const [bank, setBank] = useState('');
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 계좌 목록 & 선택값
  const [accounts, setAccounts] = useState<DepositTrustAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    if (isOpen) window.scrollTo({ top: 0, behavior: 'auto' });
    if (!isOpen) {
      setBank('');
      setBankId('');
      setPassword('');
      setSubmitting(false);
      setErrorMsg(null);
      setAccounts([]);
      setSelectedAccount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canFetchAccounts = !!bank && !!bankId.trim() && !!password.trim();
  const canSubmit = !!selectedAccount && !!bank && !submitting;

  // ----- API helpers -----
  const createConnectedIdBK = (organization: string, id: string, pw: string) =>
    axios.post(
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

  const addCredentialBK = (organization: string, id: string, pw: string) =>
    axios.post(
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

  const fetchBankAccounts = async (organization: string) => {
    const { data } = await axios.get(`${BASE_URL}/api/codef/bank/accounts`, {
      params: { organization },
      withCredentials: true,
    });
    const list: DepositTrustAccount[] = (data?.data?.resDepositTrust ?? []).map((a: any) => ({
      resAccount: a.resAccount,
      resAccountDisplay: a.resAccountDisplay,
      resAccountName: a.resAccountName,
      resAccountBalance: a.resAccountBalance,
    }));
    return list;
  };

  const linkTripAccount = async (organizationCode: string, acctNo: string, planId: number) => {
    await axios.post(
      `${BASE_URL}/api/codef/accounts/bank`,
      { organizationCode, accountNumber: acctNo, tripPlanId: planId },
      { withCredentials: true },
    );
  };

  // 1) 인증/연결 및 계좌 목록 불러오기
  const handleFetchAccounts = async () => {
    if (!canFetchAccounts) return;
    setSubmitting(true);
    setErrorMsg(null);
    setAccounts([]);
    setSelectedAccount('');

    try {
      // connected-id 시도 → 실패 시 credentials 추가
      try {
        await createConnectedIdBK(bank, bankId, password);
      } catch {
        await addCredentialBK(bank, bankId, password);
      }

      const list = await fetchBankAccounts(bank);
      if (!list.length) {
        throw new Error('조회 가능한 예금/신탁 계좌가 없습니다.');
      }
      setAccounts(list);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '계좌 목록을 불러오지 못했습니다. 정보를 확인해 주세요.';
      setErrorMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  // 2) 선택된 계좌로 여행 플랜 연결
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await linkTripAccount(bank, selectedAccount, tripPlanId);
      // 성공 시 즉시 부모 알림 & 모달 닫기
      onConnected?.(bank, selectedAccount);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '계좌 연동에 실패했습니다. 다시 시도해 주세요.';
      setErrorMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <Title>어떤 계좌와 연결할까요?</Title>

        {/* 1. 은행/아이디/비밀번호 입력 */}
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
          <Label htmlFor="bankId">은행사 아이디</Label>
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
          <Label htmlFor="password">은행사 비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </FieldWrapper>

        <ConfirmButton onClick={handleFetchAccounts} disabled={!canFetchAccounts || submitting}>
          {submitting ? '인증/조회 중…' : '인증하고 계좌 불러오기'}
        </ConfirmButton>

        {/* 2. 계좌 목록 라디오 선택 */}
        {accounts.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>계좌 선택</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {accounts.map((a) => (
                <li key={a.resAccount} style={{ marginBottom: 8 }}>
                  <label
                    style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="account"
                      value={a.resAccount}
                      checked={selectedAccount === a.resAccount}
                      onChange={() => setSelectedAccount(a.resAccount)}
                    />
                    <span>
                      {a.resAccountName} · {a.resAccountDisplay} · 잔액{' '}
                      {Number(a.resAccountBalance).toLocaleString()}원
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <ConfirmButton onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? '연결 중…' : '이 계좌로 연결'}
            </ConfirmButton>
          </div>
        )}

        {errorMsg && (
          <p style={{ color: '#ff6868', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>
            {errorMsg}
          </p>
        )}
      </ModalContainer>
    </Overlay>
  );
}
