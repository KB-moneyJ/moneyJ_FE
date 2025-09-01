import { CircleUserRound, Bell } from 'lucide-react';

import styles from './Home.module.css';
import logoJ from '@/assets/images/logo-j.png';
import Card from '@/components/common/Card/Card';

export default function Home() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.profile}>
          <CircleUserRound className={styles.icon} />
          <span className={styles.nickname}>USERNAME</span>
        </div>
        <Bell className={styles.bell} />
      </div>

      <Card className={`${styles.cardSpacing} ${styles.assetCard}`}>
        <div className={styles.assetHeader}>
          <span className={styles.assetTitle}>MY 자산</span>
        </div>

        <div className={styles.assetBody}>
          <div className={styles.assetLeft}>
            <div className={styles.brandAvatar}>
              <img className={styles.brandMark} src={logoJ} alt="MoneyJ 로고" />
            </div>
            <span className={styles.amount}>1,031,000원</span>
          </div>

          <button className={styles.saveBtn}>저축</button>
        </div>
      </Card>
    </div>
  );
}
