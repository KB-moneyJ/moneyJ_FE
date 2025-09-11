import logo from '@/assets/images/moneyJ-Logo.png';
import kakaologo from '@/assets/images/kakao-Logo.png';
import styles from './Login.module.css';

import { loginWithKakao } from '@/api/auth/auth';

const goToKakaoLogin = async () => {
  loginWithKakao();
};

export default function Login() {
  return (
    <div className={styles.wrap}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="Splash Screen" draggable={false} />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.inlineText}>
          <span>저축과 여행을 한눈에, </span>
          <span className={styles.colorText}>moneyJ</span>
          <span>와 함께</span>
        </div>
        <p>목표를 세우고, 친구와 함께 모으고, 여행을 완성하세요</p>
      </div>
      <div>
        <div className={styles.kakaoButton} onClick={goToKakaoLogin}>
          <img className={styles.kakaoLogo} src={kakaologo} alt="Splash Screen" draggable={false} />
          <span>카카오로 시작하기</span>
        </div>
      </div>
    </div>
  );
}
