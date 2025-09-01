import { CircleUserRound } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <CircleUserRound className={styles.icon} />
      <span className={styles.nickname}>사용자 닉네임</span>
    </div>
  );
}
