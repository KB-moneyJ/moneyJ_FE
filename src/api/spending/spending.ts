const BASE_URL = import.meta.env.VITE_API_URL as string;
import axios from 'axios';

function formatDate(date: Date): string {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export async function connectCard(organization: string, id: string, password: string) {
  try {
    const today = new Date();

    const endDate = formatDate(today);

    const start = new Date(today);
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);
    const startDate = formatDate(start);

    const res = await axios.post(
      `${BASE_URL}/api/codef/connected-id`,
      {
        accountList: [
          {
            countryCode: 'KR',
            businessType: 'CD',
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
    console.log('카드 연결 성공:', res.data);
    console.log(organization, startDate, endDate);

    const result = await axios.post(
      `${BASE_URL}/transactions/save`,
      {
        organization,
        startDate,
        endDate,
      },
      { withCredentials: true },
    );
    console.log('거래 내역 저장 성공:', result.data);
  } catch (err) {
    console.error('카드 연결 실패:', err);
    throw err;
  }
}

export async function getSummary() {
  const res = await axios.get(`${BASE_URL}/summary`, { withCredentials: true });
  return res.data;
}

export async function getMonthCategory(month: string, category: string) {
  const res = await axios.get(`${BASE_URL}/summary/category?month=${month}&category=${category}`);
  return res.data;
}
