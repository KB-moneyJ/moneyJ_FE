const BASE_URL = import.meta.env.VITE_API_URL as string;
import axios from 'axios';

function formatDate(date: Date): string {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// 2-1. 카드 목록 조회 및 기관 연결 Response
export type CardConnectResponse = {
  cardName: string;
  cardNo: string; // 마스킹 된 번호 or 전체 번호? Spec example: "1234-****-****-5678"
  organizationCode: string;
};

// 2-2. 카드 저장 Response
export type CardLinkResponse = {
  cardId: number;
  cardName: string;
  cardNo: string;
  organizationCode: string;
};

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

export async function connectCard(organization: string, id: string, password: string): Promise<CardConnectResponse[]> {
  try {
    const { data } = await axios.post<CardConnectResponse[]>(
      `${BASE_URL}/api/cards/connect`,
      {
        countryCode: 'KR',
        businessType: 'CD',
        clientType: 'P',
        organization,
        loginType: '1',
        id,
        password,
      },
      {
        headers: getAuthHeader(),
      },
    );
    return data;
  } catch (err) {
    console.error('카드 연결 실패:', err);
    throw err;
  }
}

export async function linkCard(params: {
  cardName: string;
  cardNo: string;
  organizationCode: string;
}): Promise<CardLinkResponse> {
  // 카드 번호에서 하이픈 제거
  const cleanCardNo = params.cardNo.replace(/-/g, '');

  const { data } = await axios.post<CardLinkResponse>(
    `${BASE_URL}/api/cards/link`,
    {
      ...params,
      cardNo: cleanCardNo,
    },
    {
      headers: getAuthHeader(),
    },
  );
  return data;
}




export async function saveTransactions(params: {
  cardName: string;
  cardNo: string;
  organizationCode: string;
  cardPassword?: string;
  birthDate?: string;
}): Promise<any> {
  const cleanCardNo = params.cardNo.replace(/-/g, '');
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const endDate = `${year}${month}${day}`;

  // 6개월 전
  const startD = new Date();
  startD.setMonth(startD.getMonth() - 6);
  const sYear = startD.getFullYear();
  const sMonth = String(startD.getMonth() + 1).padStart(2, '0');
  const sDay = String(startD.getDate()).padStart(2, '0');
  const startDate = `${sYear}${sMonth}${sDay}`;

  // 트랜잭션 저장 API 호출
  const { data } = await axios.post(
    `${BASE_URL}/transactions/save`,
    {
      organization: params.organizationCode,
      birthDate: params.birthDate || '19990101', // Default
      startDate: startDate,
      endDate: endDate,
      orderBy: '1', // DESC
      inquiryType: '1',
      cardName: params.cardName,
      duplicateCardIdx: '',
      cardNo: cleanCardNo,
      cardPassword: params.cardPassword || '',
      memberStoreInfoType: '1',
    },
    {
      headers: getAuthHeader(),
    },
  );
  return data;
}


export async function getSummary() {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`${BASE_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('요약 데이터:', res.data);
  return res.data;
}

export async function getMonthCategory(month: string, category: string) {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`${BASE_URL}/summary/category?month=${month}&category=${category}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
