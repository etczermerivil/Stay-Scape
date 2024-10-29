// HomePage.jsx
// import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToLanding = () => {
    navigate('/landing');
  };

  return (
    <div className={styles.videoBackground}>
      <video autoPlay muted loop playsInline className={styles.video}>
        <source src="/videos/Splash-Page.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay}>
        <h1 className={styles.overlayTitle}>Stay Scape</h1>
        <p className={styles.overlayParagraph}> Stay Somewhere Unforgettable </p>
        <button onClick={navigateToLanding} className={styles.enterButton}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default HomePage;
