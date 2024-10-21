import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/review';
import { fetchReviews } from '../../store/review';  // Update the path based on your folder structure

import useModal from '../../context/useModal'; // Import useModal
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, spotId }) {  // Ensure spotId is being destructured correctly
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
      dispatch(deleteReview(reviewId, spotId))
        .then(() => {
          dispatch(fetchReviews(spotId));  // Use spotId correctly here
          closeModal();
        });
    };

    return (
      <div className="delete-review-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <button className="delete-button" onClick={handleDelete}>Yes (Delete Review)</button>
        <button className="cancel-button" onClick={closeModal}>No (Keep Review)</button>
      </div>
    );
  }

export default DeleteReviewModal;
