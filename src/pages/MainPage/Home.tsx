import { CircleUserRound, Bell } from 'lucide-react';
import styles from './Home.module.css';

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
      <Card>
        <h3>8월 사용 금액</h3>
        <p>1,031,000원</p>
      </Card>
    </div>
  );
}
