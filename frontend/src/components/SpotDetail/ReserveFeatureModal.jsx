import useModal from '../../context/useModal';
import styles from './ReserveFeatureModal.module.css';  // Import the CSS Module

function ReserveModal() {
  const { closeModal } = useModal();  // Get the closeModal function

  const handleBackgroundClick = (e) => {
    // Ensure we only close the modal if the user clicks on the background, not the modal content itself
    if (e.target.classList.contains(styles.modalBackground)) {
      closeModal();
    }
  };

  return (
    <div className={styles.modalBackground} onClick={handleBackgroundClick}>
      <div className={styles.reserveModalContent}>
        <p className={styles.reserveModalText}>Feature Coming Soon...</p>
      </div>
    </div>
  );
}

export default ReserveModal;
