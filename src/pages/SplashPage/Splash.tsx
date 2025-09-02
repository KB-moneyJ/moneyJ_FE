import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Splash.module.css';
import logo from '@/assets/images/moneyJ-Logo.png';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.wrap}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="Splash Screen" draggable={false} />
      </div>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBar}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </div>
  );
}
