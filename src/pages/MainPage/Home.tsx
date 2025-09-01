import { CircleUserRound, Bell } from 'lucide-react';
import styles from './Home.module.css';

import AssetCard from './sections/AssetCard/AssetCard';

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
      <AssetCard />
    </div>
  );
}
