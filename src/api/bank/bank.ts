// src/api/bank/bank.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL as string;
const token = localStorage.getItem('accessToken');

/* ====================== Types (필요한 필드만) ====================== */

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
  result: { code: string; message: string; extraMessage: string };
  data: {
    accountList: Array<{
      clientType: 'P';
      loginType: '1';
      countryCode: 'KR';
      organization: string;
      businessType: 'BK' | 'CD';
    }>;
    connectedId: string;
  };
};

// ❗ FE에서 실제로 쓰는 최소 계좌 모델 (표시/선택용)
export type BankAccount = {
  accountNumber: string; // 원본 계좌번호 (resAccount, 숫자만)
  accountNumberDisplay: string; // 마스킹/하이픈 포함 표시용
  accountName: string; // 상품/계좌명
  balance?: number; // (옵션) 목록에서 바로 보여줄 때만 사용
};

// CODEF 원응답 중 필요한 최소 필드만 파싱할 때 사용
type BankAccountsResponseRaw = {
  result: { code: string };
  data: {
    resDepositTrust: Array<{
      resAccount: string;
      resAccountDisplay: string;
      resAccountName: string;
      resAccountBalance: string;
    }>;
  };
};

export type TripPlanAccountSaveResponse = {
  accountName: string;
  accountNumberDisplay: string; // 7357****1086
  balance: number;
};

/* ====================== Utils ====================== */

const CF_SUCCESS = 'CF-00000';
const CF_DUP = 'CF-00016'; // 동일 요청 처리 중

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms: number) => Math.max(0, Math.floor(ms * (0.8 + Math.random() * 0.4)));
const digits = (s: string) => s.replace(/\D/g, '');

const isHttp429 = (e: any) => e?.response?.status === 429;
const isServerDupMsg = (e: any) =>
  /중복 요청|동일한 요청|처리 중/i.test(e?.response?.data?.message ?? '');

/* ====================== 동시 호출 합치기 ====================== */
// 같은 은행(org) 계좌 목록을 동시에 불러오면 1회만 네트워크 호출
const inflightAccounts = new Map<string, Promise<BankAccount[]>>();
// 같은 tripPlanId 잔액 새로고침도 1회만
const inflightRefresh = new Map<number, Promise<TripPlanAccountSaveResponse>>();

/* ====================== API: ConnectedId / 자격추가 / 목록 ====================== */

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
    {
      headers: { Authorization: `Bearer ${token}` },
    },
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
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export async function getCredentialsList(): Promise<GetCredentialsListResponse> {
  const { data } = await axios.get<GetCredentialsListResponse>(
    `${BASE_URL}/api/codef/credentials`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

/* ====================== API: 계좌 목록 (필요 필드만 매핑) ====================== */

async function fetchAccountsOnce(organization: BankOrganizationCode): Promise<BankAccount[]> {
  const { data } = await axios.get<BankAccountsResponseRaw>(`${BASE_URL}/api/codef/bank/accounts`, {
    params: { organization },

    headers: { Authorization: `Bearer ${token}` },
  });

  if (data?.result?.code !== CF_SUCCESS) {
    throw new Error(`계좌목록 실패(code:${data?.result?.code || 'UNKNOWN'})`);
  }

  const list = data?.data?.resDepositTrust ?? [];
  return list.map((it) => ({
    accountNumber: digits(it.resAccount),
    accountNumberDisplay: it.resAccountDisplay,
    accountName: it.resAccountName,
    // 필요 시 목록에서 잔액 보여줄 때만 parse:
    balance: it.resAccountBalance ? Number(it.resAccountBalance) : undefined,
  }));
}

/**
 * 계좌 목록 조회 (중복 호출 병합 + 소량 재시도)
 * - 동일 org 동시호출 시 1회로 합치기
 * - 429/CF-00016/“동일한 요청 처리 중” 메시지에서만 최대 2회 재시도
 */
export async function fetchBankAccounts(
  organization: BankOrganizationCode,
): Promise<BankAccount[]> {
  const key = organization;
  const inflight = inflightAccounts.get(key);
  if (inflight) return inflight;

  const p = (async () => {
    let delay = 600;
    for (let i = 0; i < 3; i++) {
      try {
        return await fetchAccountsOnce(organization);
      } catch (e: any) {
        const code = String(e?.message ?? '');
        const retryable = isHttp429(e) || isServerDupMsg(e) || code.includes(CF_DUP);
        if (!retryable || i === 2) throw e;
        await sleep(jitter(delay));
        delay = Math.min(delay * 2, 2000);
      }
    }
    // 논리상 도달 X
    throw new Error('계좌목록 재시도 초과');
  })();

  inflightAccounts.set(key, p);
  try {
    return await p;
  } finally {
    inflightAccounts.delete(key);
  }
}

/* ====================== API: 플랜 계좌 연결/변경/잔액 ====================== */

export async function linkTripPlanAccount(params: {
  organizationCode: BankOrganizationCode;
  accountNumber: string; // digits(resAccount)
  tripPlanId: number;
}): Promise<TripPlanAccountSaveResponse> {
  const { data } = await axios.post<TripPlanAccountSaveResponse>(
    `${BASE_URL}/api/codef/accounts/bank`,
    params,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export async function refreshTripPlanBalance(
  tripPlanId: number,
): Promise<TripPlanAccountSaveResponse> {
  const { data } = await axios.post<TripPlanAccountSaveResponse>(
    `${BASE_URL}/api/codef/accounts/bank`,
    { tripPlanId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export async function changeTripPlanAccount(params: {
  organizationCode: BankOrganizationCode;
  accountNumber: string;
  tripPlanId: number;
}): Promise<TripPlanAccountSaveResponse> {
  return linkTripPlanAccount(params);
}

export async function deleteBankCredential(params: {
  organizationCode: BankOrganizationCode;
  businessType?: 'BK';
  loginType?: '1';
}): Promise<CredentialsResult> {
  const { data } = await axios.delete<CredentialsResult>(`${BASE_URL}/api/codef/delete`, {
    data: {
      organizationCode: params.organizationCode,
      businessType: params.businessType ?? 'BK',
      loginType: params.loginType ?? '1',
    },

    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * 잔액 새로고침 보호 래퍼 (가벼운 버전)
 * - 동시 호출 합치기
 * - 429/중복요청 시 최대 2회 재시도
 * - 자동 재연결(relink) 같은 무거운 보정은 프론트에서 “계좌 재선택” UX로 처리 권장
 */
export async function refreshTripPlanBalanceWithRetry(
  tripPlanId: number,
  opts?: { tries?: number; initialDelayMs?: number; organizationCode?: BankOrganizationCode },
): Promise<TripPlanAccountSaveResponse> {
  const exist = inflightRefresh.get(tripPlanId);
  if (exist) return exist;

  const p = (async () => {
    const tries = opts?.tries ?? 3;
    let delay = opts?.initialDelayMs ?? 500;

    for (let i = 0; i < tries; i++) {
      try {
        return await refreshTripPlanBalance(tripPlanId);
      } catch (e: any) {
        const retryable = isHttp429(e) || isServerDupMsg(e);
        if (!retryable || i === tries - 1) throw e;
        await sleep(jitter(delay));
        delay = Math.min(delay * 2, 1500);
      }
    }
    // 논리상 도달 X
    throw new Error('잔액 재시도 초과');
  })();

  inflightRefresh.set(tripPlanId, p);
  try {
    return await p;
  } finally {
    inflightRefresh.delete(tripPlanId);
  }
}

// 호출 너무 많이 해서 일단 주석
// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL as string;

// export type BankOrganizationCode =
//   | '0002'
//   | '0003'
//   | '0004'
//   | '0007'
//   | '0011'
//   | '0020'
//   | '0023'
//   | '0027'
//   | '0031'
//   | '0032'
//   | '0034'
//   | '0035'
//   | '0037'
//   | '0039'
//   | '0045'
//   | '0048'
//   | '0071'
//   | '0081'
//   | '0088'
//   | '0089';

// export type ConnectedIdResponse = { connectedId: string };

// export type CredentialsResult = {
//   code: string; // 'CF-00000' 이면 성공
//   extraMessage: string;
//   message: string; // '성공'
//   transactionId: string;
// };

// export type GetCredentialsListResponse = {
//   result: { code: string; extraMessage: string; message: string };
//   data: {
//     accountList: Array<{
//       clientType: 'P';
//       loginType: '1';
//       countryCode: 'KR';
//       organization: string; // 기관코드
//       businessType: 'BK' | 'CD';
//     }>;
//     connectedId: string;
//   };
// };

// export type BankAccountsResponse = {
//   result: { code: string; extraMessage: string; message: string; transactionId: string };
//   clientType: 'P';
//   data: {
//     resDepositTrust: Array<{
//       resAccount: string;
//       resAccountBalance: string;
//       resAccountDeposit: string;
//       resAccountNickName: string;
//       resAccountCurrency: string;
//       resAccountStartDate: string;
//       resAccountEndDate: string;
//       resLastTranDate: string;
//       resAccountName: string;
//       resAccountLifetime: string;
//       resAccountDisplay: string;
//       resOverdraftAcctYN: '0' | '1';
//       resLoanKind: string;
//       resLoanBalance: string;
//       resLoanStartDate: string;
//       resLoanEndDate: string;
//     }>;
//     resForeignCurrency: unknown[];
//     resFund: unknown[];
//     resLoan: unknown[];
//     resInsurance: unknown[];
//   };
//   countryCode: 'KR';
//   businessType: 'BK';
//   connectedId: string;
// };

// export type TripPlanAccountSaveResponse = {
//   accountName: string;
//   accountNumberDisplay: string;
//   balance: number;
// };

// function assertCFSuccess(code: string, context: string) {
//   if (code !== 'CF-00000') {
//     throw new Error(`${context} 실패 (code: ${code})`);
//   }
// }

// export async function createBankConnectedId(
//   organization: BankOrganizationCode,
//   id: string,
//   password: string,
// ): Promise<ConnectedIdResponse> {
//   const { data } = await axios.post<ConnectedIdResponse>(
//     `${BASE_URL}/api/codef/connected-id`,
//     {
//       accountList: [
//         {
//           countryCode: 'KR',
//           businessType: 'BK',
//           clientType: 'P',
//           organization,
//           loginType: '1',
//           id,
//           password,
//         },
//       ],
//     },
//     { withCredentials: true },
//   );
//   return data;
// }

// export async function addBankCredential(
//   organization: BankOrganizationCode,
//   id: string,
//   password: string,
// ): Promise<CredentialsResult> {
//   const { data } = await axios.post<CredentialsResult>(
//     `${BASE_URL}/api/codef/credentials`,
//     {
//       countryCode: 'KR',
//       businessType: 'BK',
//       clientType: 'P',
//       organization,
//       loginType: '1',
//       id,
//       password,
//     },
//     { withCredentials: true },
//   );
//   return data;
// }

// // ----- 내 커넥티드ID에 어떤 계정(은행/카드)들이 연결됐는지 조회 -----
// export async function getCredentialsList(): Promise<GetCredentialsListResponse> {
//   const { data } = await axios.get<GetCredentialsListResponse>(
//     `${BASE_URL}/api/codef/credentials`,
//     { withCredentials: true },
//   );
//   return data;
// }

// // ----- 특정 은행의 보유 계좌 목록 조회 -----
// export async function fetchBankAccounts(
//   organization: BankOrganizationCode,
// ): Promise<BankAccountsResponse> {
//   const { data } = await axios.get<BankAccountsResponse>(`${BASE_URL}/api/codef/bank/accounts`, {
//     params: { organization },
//     withCredentials: true,
//   });
//   // 성공 코드 확인
//   assertCFSuccess(data.result?.code, '은행 계좌 목록 조회');
//   return data;
// }

// // ----- 여행 플랜에 계좌 연결/변경/잔액조회 (동일 엔드포인트) -----
// // 최초 연결(계좌 선택 후 저장), 변경, 잔액조회 모두 /api/codef/accounts/bank 사용
// export async function linkTripPlanAccount(params: {
//   organizationCode: BankOrganizationCode;
//   accountNumber: string; // resAccount 사용
//   tripPlanId: number;
// }): Promise<TripPlanAccountSaveResponse> {
//   const { data } = await axios.post<TripPlanAccountSaveResponse>(
//     `${BASE_URL}/api/codef/accounts/bank`,
//     params,
//     { withCredentials: true },
//   );
//   return data;
// }

// // 연동 이후 잔액 조회 전용
// export async function refreshTripPlanBalance(
//   tripPlanId: number,
// ): Promise<TripPlanAccountSaveResponse> {
//   const { data } = await axios.post<TripPlanAccountSaveResponse>(
//     `${BASE_URL}/api/codef/accounts/bank`,
//     { tripPlanId },
//     { withCredentials: true },
//   );
//   return data;
// }

// // 계좌 변경 전용
// export async function changeTripPlanAccount(params: {
//   organizationCode: BankOrganizationCode;
//   accountNumber: string;
//   tripPlanId: number;
// }): Promise<TripPlanAccountSaveResponse> {
//   return linkTripPlanAccount(params);
// }

// // ----- plus: 연결 해제 (특정 은행 계정 삭제) -----
// export async function deleteBankCredential(params: {
//   organizationCode: BankOrganizationCode;
//   businessType?: 'BK'; // 기본 BK
//   loginType?: '1';
// }): Promise<CredentialsResult> {
//   const { data } = await axios.delete<CredentialsResult>(`${BASE_URL}/api/codef/delete`, {
//     data: {
//       organizationCode: params.organizationCode,
//       businessType: params.businessType ?? 'BK',
//       loginType: params.loginType ?? '1',
//     },
//     withCredentials: true,
//   });
//   return data;
// }

// // --- retry & fallback utils -------------------------------------------------

// function sleep(ms: number) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// function normalizeDigits(s?: string) {
//   return (s ?? '').replace(/\D/g, '').replace(/^0+(?!$)/, '');
// }

// /** CODEF 계좌목록: CF-00016(중복요청) 발생 시 지수 백오프 재시도 */
// export async function fetchBankAccountsWithRetry(
//   organization: BankOrganizationCode,
//   tries = 5,
//   initialDelayMs = 250,
// ): Promise<BankAccountsResponse> {
//   let delay = initialDelayMs;
//   for (let i = 0; i < tries; i++) {
//     const { data } = await axios.get<BankAccountsResponse>(`${BASE_URL}/api/codef/bank/accounts`, {
//       params: { organization },
//       withCredentials: true,
//     });

//     const code = data?.result?.code;
//     if (code === 'CF-00000') return data;

//     // CODEF가 "동일한 요청 처리 중" → 잠깐 기다렸다 재시도
//     if (code === 'CF-00016') {
//       await sleep(delay);
//       delay = Math.min(delay * 2, 2000);
//       continue;
//     }

//     throw new Error(`은행 계좌 목록 조회 실패 (code: ${code || 'UNKNOWN'})`);
//   }
//   throw new Error('은행 계좌 목록 조회 재시도 초과');
// }

// /**
//  * 잔액 조회(새로고침 시) 보호 래퍼
//  * - 429/“중복 요청” 류는 프론트에서 짧게 재시도
//  * - 여전히 실패 & org 전달된 경우: 계좌목록 재조회 → (last4가 있으면) 같은 계좌 추정 → 자동 재연결(linkTripPlanAccount)
//  */
// export async function refreshTripPlanBalanceWithRetry(
//   tripPlanId: number,
//   opts?: {
//     tries?: number;
//     initialDelayMs?: number;
//     organizationCode?: BankOrganizationCode; // 로컬에 저장해둔 org
//     acctLast4?: string; // 로컬에 저장해둔 계좌 뒷4자리(선택)
//   },
// ): Promise<TripPlanAccountSaveResponse> {
//   const tries = opts?.tries ?? 3;
//   let delay = opts?.initialDelayMs ?? 400;

//   for (let i = 0; i < tries; i++) {
//     try {
//       return await refreshTripPlanBalance(tripPlanId);
//     } catch (e: any) {
//       const status = e?.response?.status;
//       const msg = (e?.response?.data?.message as string | undefined) || '';

//       // 서버가 429(혹은 “중복 요청/동일한 요청 처리 중”)이면 잠깐 대기 후 재시도
//       if (status === 429 || /중복 요청|동일한 요청|처리 중/i.test(msg)) {
//         await sleep(delay);
//         delay = Math.min(delay * 2, 1500);
//         continue;
//       }

//       const org = opts?.organizationCode;
//       if (org) {
//         try {
//           const list = await fetchBankAccountsWithRetry(org, 5);
//           const accounts = list?.data?.resDepositTrust ?? [];
//           const pick =
//             (opts?.acctLast4 &&
//               accounts.find(
//                 (a) =>
//                   normalizeDigits(a.resAccount).endsWith(opts.acctLast4!) ||
//                   normalizeDigits(a.resAccountDisplay).endsWith(opts.acctLast4!),
//               )) ||
//             accounts[0];

//           if (!pick?.resAccount) throw new Error('NO_ACCOUNT_CANDIDATE');

//           const relink = await linkTripPlanAccount({
//             organizationCode: org,
//             accountNumber: normalizeDigits(pick.resAccount),
//             tripPlanId,
//           });

//           return relink;
//         } catch {}
//       }

//       throw e;
//     }
//   }
//   return await refreshTripPlanBalance(tripPlanId);
// }
