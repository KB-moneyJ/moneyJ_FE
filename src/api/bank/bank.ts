import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL as string;

export type BankOrganizationCode =
  | '0002'
  | '0003'
  | '0004'
  | '0007'
  | '0011'
  | '0020'
  | '0023'
  | '0027'
  | '0031'
  | '0032'
  | '0034'
  | '0035'
  | '0037'
  | '0039'
  | '0045'
  | '0048'
  | '0071'
  | '0081'
  | '0088'
  | '0089';

export type ConnectedIdResponse = { connectedId: string };

export type CredentialsResult = {
  code: string; // 'CF-00000' 이면 성공
  extraMessage: string;
  message: string; // '성공'
  transactionId: string;
};

export type GetCredentialsListResponse = {
  result: { code: string; extraMessage: string; message: string };
  data: {
    accountList: Array<{
      clientType: 'P';
      loginType: '1';
      countryCode: 'KR';
      organization: string; // 기관코드
      businessType: 'BK' | 'CD';
    }>;
    connectedId: string;
  };
};

export type BankAccountsResponse = {
  result: { code: string; extraMessage: string; message: string; transactionId: string };
  clientType: 'P';
  data: {
    resDepositTrust: Array<{
      resAccount: string;
      resAccountBalance: string;
      resAccountDeposit: string;
      resAccountNickName: string;
      resAccountCurrency: string;
      resAccountStartDate: string;
      resAccountEndDate: string;
      resLastTranDate: string;
      resAccountName: string;
      resAccountLifetime: string;
      resAccountDisplay: string;
      resOverdraftAcctYN: '0' | '1';
      resLoanKind: string;
      resLoanBalance: string;
      resLoanStartDate: string;
      resLoanEndDate: string;
    }>;
    resForeignCurrency: unknown[];
    resFund: unknown[];
    resLoan: unknown[];
    resInsurance: unknown[];
  };
  countryCode: 'KR';
  businessType: 'BK';
  connectedId: string;
};

export type TripPlanAccountSaveResponse = {
  accountName: string;
  accountNumberDisplay: string;
  balance: number;
};

function assertCFSuccess(code: string, context: string) {
  if (code !== 'CF-00000') {
    throw new Error(`${context} 실패 (code: ${code})`);
  }
}

export async function createBankConnectedId(
  organization: BankOrganizationCode,
  id: string,
  password: string,
): Promise<ConnectedIdResponse> {
  const { data } = await axios.post<ConnectedIdResponse>(
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
          password,
        },
      ],
    },
    { withCredentials: true },
  );
  return data;
}

export async function addBankCredential(
  organization: BankOrganizationCode,
  id: string,
  password: string,
): Promise<CredentialsResult> {
  const { data } = await axios.post<CredentialsResult>(
    `${BASE_URL}/api/codef/credentials`,
    {
      countryCode: 'KR',
      businessType: 'BK',
      clientType: 'P',
      organization,
      loginType: '1',
      id,
      password,
    },
    { withCredentials: true },
  );
  return data;
}

// ----- 내 커넥티드ID에 어떤 계정(은행/카드)들이 연결됐는지 조회 -----
export async function getCredentialsList(): Promise<GetCredentialsListResponse> {
  const { data } = await axios.get<GetCredentialsListResponse>(
    `${BASE_URL}/api/codef/credentials`,
    { withCredentials: true },
  );
  return data;
}

// ----- 특정 은행의 보유 계좌 목록 조회 -----
export async function fetchBankAccounts(
  organization: BankOrganizationCode,
): Promise<BankAccountsResponse> {
  const { data } = await axios.get<BankAccountsResponse>(`${BASE_URL}/api/codef/bank/accounts`, {
    params: { organization },
    withCredentials: true,
  });
  // 성공 코드 확인
  assertCFSuccess(data.result?.code, '은행 계좌 목록 조회');
  return data;
}

// ----- 여행 플랜에 계좌 연결/변경/잔액조회 (동일 엔드포인트) -----
// 최초 연결(계좌 선택 후 저장), 변경, 잔액조회 모두 /api/codef/accounts/bank 사용
export async function linkTripPlanAccount(params: {
  organizationCode: BankOrganizationCode;
  accountNumber: string; // resAccount 사용
  tripPlanId: number;
}): Promise<TripPlanAccountSaveResponse> {
  const { data } = await axios.post<TripPlanAccountSaveResponse>(
    `${BASE_URL}/api/codef/accounts/bank`,
    params,
    { withCredentials: true },
  );
  return data;
}

// 연동 이후 잔액 조회 전용
export async function refreshTripPlanBalance(
  tripPlanId: number,
): Promise<TripPlanAccountSaveResponse> {
  const { data } = await axios.post<TripPlanAccountSaveResponse>(
    `${BASE_URL}/api/codef/accounts/bank`,
    { tripPlanId },
    { withCredentials: true },
  );
  return data;
}

// 계좌 변경 전용
export async function changeTripPlanAccount(params: {
  organizationCode: BankOrganizationCode;
  accountNumber: string;
  tripPlanId: number;
}): Promise<TripPlanAccountSaveResponse> {
  return linkTripPlanAccount(params);
}

// ----- plus: 연결 해제 (특정 은행 계정 삭제) -----
export async function deleteBankCredential(params: {
  organizationCode: BankOrganizationCode;
  businessType?: 'BK'; // 기본 BK
  loginType?: '1';
}): Promise<CredentialsResult> {
  const { data } = await axios.delete<CredentialsResult>(`${BASE_URL}/api/codef/delete`, {
    data: {
      organizationCode: params.organizationCode,
      businessType: params.businessType ?? 'BK',
      loginType: params.loginType ?? '1',
    },
    withCredentials: true,
  });
  return data;
}

// --- retry & fallback utils -------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeDigits(s?: string) {
  return (s ?? '').replace(/\D/g, '').replace(/^0+(?!$)/, '');
}

/** CODEF 계좌목록: CF-00016(중복요청) 발생 시 지수 백오프 재시도 */
export async function fetchBankAccountsWithRetry(
  organization: BankOrganizationCode,
  tries = 5,
  initialDelayMs = 250,
): Promise<BankAccountsResponse> {
  let delay = initialDelayMs;
  for (let i = 0; i < tries; i++) {
    const { data } = await axios.get<BankAccountsResponse>(`${BASE_URL}/api/codef/bank/accounts`, {
      params: { organization },
      withCredentials: true,
    });

    const code = data?.result?.code;
    if (code === 'CF-00000') return data;

    // CODEF가 "동일한 요청 처리 중" → 잠깐 기다렸다 재시도
    if (code === 'CF-00016') {
      await sleep(delay);
      delay = Math.min(delay * 2, 2000);
      continue;
    }

    throw new Error(`은행 계좌 목록 조회 실패 (code: ${code || 'UNKNOWN'})`);
  }
  throw new Error('은행 계좌 목록 조회 재시도 초과');
}

/**
 * 잔액 조회(새로고침 시) 보호 래퍼
 * - 429/“중복 요청” 류는 프론트에서 짧게 재시도
 * - 여전히 실패 & org 전달된 경우: 계좌목록 재조회 → (last4가 있으면) 같은 계좌 추정 → 자동 재연결(linkTripPlanAccount)
 */
export async function refreshTripPlanBalanceWithRetry(
  tripPlanId: number,
  opts?: {
    tries?: number;
    initialDelayMs?: number;
    organizationCode?: BankOrganizationCode; // 로컬에 저장해둔 org
    acctLast4?: string; // 로컬에 저장해둔 계좌 뒷4자리(선택)
  },
): Promise<TripPlanAccountSaveResponse> {
  const tries = opts?.tries ?? 3;
  let delay = opts?.initialDelayMs ?? 400;

  for (let i = 0; i < tries; i++) {
    try {
      return await refreshTripPlanBalance(tripPlanId);
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = (e?.response?.data?.message as string | undefined) || '';

      // 서버가 429(혹은 “중복 요청/동일한 요청 처리 중”)이면 잠깐 대기 후 재시도
      if (status === 429 || /중복 요청|동일한 요청|처리 중/i.test(msg)) {
        await sleep(delay);
        delay = Math.min(delay * 2, 1500);
        continue;
      }

      const org = opts?.organizationCode;
      if (org) {
        try {
          const list = await fetchBankAccountsWithRetry(org, 5);
          const accounts = list?.data?.resDepositTrust ?? [];
          const pick =
            (opts?.acctLast4 &&
              accounts.find(
                (a) =>
                  normalizeDigits(a.resAccount).endsWith(opts.acctLast4!) ||
                  normalizeDigits(a.resAccountDisplay).endsWith(opts.acctLast4!),
              )) ||
            accounts[0];

          if (!pick?.resAccount) throw new Error('NO_ACCOUNT_CANDIDATE');

          const relink = await linkTripPlanAccount({
            organizationCode: org,
            accountNumber: normalizeDigits(pick.resAccount),
            tripPlanId,
          });

          return relink;
        } catch {}
      }

      throw e;
    }
  }
  return await refreshTripPlanBalance(tripPlanId);
}
