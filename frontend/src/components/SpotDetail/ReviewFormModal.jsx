import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../../store/review';


import useModal from '../../context/useModal'; // Import useModal
import './ReviewFormModal.css';

function ReviewFormModal({ spotId }) {
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const dispatch = useDispatch();
  const { closeModal } = useModal(); // Use closeModal from the modal context

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(addReview({ review: reviewText, stars, spotId: Number(spotId) }))
//       .then(() => {
//         dispatch(fetchReviews(spotId)); // Refetch reviews to update the UI
//         closeModal();
//       });
//   };

const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ review: reviewText, stars, spotId: Number(spotId) }); // Check data before sending
    dispatch(addReview({ review: reviewText, stars, spotId: Number(spotId) }));
    closeModal();
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(addReview({ review: reviewText, stars, spotId: Number(spotId) }));
//     dispatch(fetchReviews(spotId));  // Re-fetch reviews after adding one
//     closeModal();  // Close the modal after the review is added
//   };

  return (
    <div className="review-form-modal">
      <h2>How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} onClick={() => setStars(num)}>
              {stars >= num ? '★' : '☆'}
            </span>
          ))}
        </div>
        <button type="submit" disabled={stars === 0}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewFormModal;
