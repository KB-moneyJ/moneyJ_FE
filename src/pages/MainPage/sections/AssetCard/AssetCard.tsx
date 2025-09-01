import styles from './AssetCard.module.css';
import logoJ from '@/assets/images/logo-j.png';
import Card from '@/components/common/Card/Card';

export default function AssetCard() {
  return (
    <Card className={styles.assetCard}>
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
  );
}
