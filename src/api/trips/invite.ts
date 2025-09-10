const BASE_URL = import.meta.env.VITE_API_URL as string;
import axios from 'axios';

export async function inviteTripMembers(planId: string, emails: string[]) {
  try {
    if (emails.some((email) => !email.trim())) {
      alert('이메일을 입력하세요.');
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/users/check`,
      { emails },
      { withCredentials: true },
    );

    console.log(planId);
    console.log('Response from /users/check:', response.data);

    const users = response.data as { email: string; exists: boolean; nickname: string | null }[];
    const me = JSON.parse(localStorage.getItem('me.public') || '{}');
    const myNickname = me.nickname;

    if (myNickname && users.some((user) => user.nickname === myNickname)) {
      alert('본인의 이메일을 입력할 수 없습니다.');
      return;
    }

    const invalidUsers = users.filter((user) => user.exists === false);

    if (invalidUsers.length > 0) {
      const invalidEmails = invalidUsers.map((user) => user.email).join(', ');
      alert(`${invalidEmails} 을(를) 가진 유저는 존재하지 않습니다.`);
      console.warn('없는 사용자들:', invalidUsers);
      return;
    }
    const res = await axios.post(
      `${BASE_URL}/trip-plans/${planId}/members`,
      { email: emails },
      { withCredentials: true },
    );
    console.log('초대 성공:', res.data);
  } catch (error) {
    console.error('Error inviting trip members:', error);
    throw error;
  }
}
