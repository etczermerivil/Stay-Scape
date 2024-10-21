import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotById } from '../../store/spot';
import { fetchReviews } from '../../store/review'; // Import fetchReviews thunk
import OpenModalButton from '../OpenModalButton';
import './SpotDetail.css';
import { MdStarRate } from 'react-icons/md';
import { LuDot } from 'react-icons/lu';
// import useModal from '../../context/useModal';
import ReviewFormModal from './ReviewFormModal';
import DeleteReviewModal from './DeleteReviewModal';

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.Spots[spotId]);
  const reviews = useSelector((state) => state.reviews.reviews); // Get reviews from Redux
  const sessionUser = useSelector((state) => state.session.user);
  // const { openModal } = useModal();

  // Fetch spot and reviews when component loads
  useEffect(() => {
    dispatch(fetchSpotById(spotId));
    dispatch(fetchReviews(spotId)); // Fetch reviews for the spot
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  console.log("Spot object in SpotDetail:", spot);
  return (
    <div className="spot-details-container">
      <h2 className="spot-title">{spot.name}</h2>
      <h3 className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </h3>

      <div className="spot-images-container">
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <>
            <img src={spot.SpotImages[0].url} alt="Spot Preview" className="preview-image" />
            <div className="smaller-images">
              {spot.SpotImages.slice(1).map((image, idx) => (
                <img key={idx} src={image.url} alt={`Spot Image ${idx + 1}`} className="spot-image" />
              ))}
            </div>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="description-price-container">
        {/* <div className="description-container">
          <h3>Hosted by {spot.Owner.firstName}</h3>
          <p className="spot-description">{spot.description}</p>
        </div> */}
        <div className="description-container">
          <h3>Hosted by {spot.Owner ? spot.Owner.firstName : 'Unknown'}</h3>
          <p className="spot-description">{spot.description}</p>
        </div>

        <div className="price-container">

        <div className="price-details">
        <h3>${spot.price} / night</h3>
        {console.log("Spot Avg Rating:", spot.avgStarRating)}
        {spot.avgStarRating && !isNaN(Number(spot.avgStarRating)) ? (
  <div>
    <MdStarRate />
    {Number(spot.avgStarRating).toFixed(2)} <LuDot /> {Object.values(reviews).length} review{Object.values(reviews).length !== 1 ? 's' : ''}
        </div>
      ) : (
        <div><MdStarRate /> New</div>
      )}

        </div>

          <button className="reserve-button">Reserve</button>
        </div>
      </div>

      <hr />

      {/* Post Your Review button - visible only if user is not the owner */}
      {sessionUser && sessionUser.id !== spot.ownerId && (
        <OpenModalButton
          buttonText="Post Your Review"
          buttonClassName="post-review-button"
          modalComponent={<ReviewFormModal spotId={spotId} />}
        />
      )}

<div className="reviews-container">
   <h3>Reviews</h3>
   {reviews && Object.values(reviews).length > 0 ? (
      Object.values(reviews).map((review) => (
         <div key={review.id} className="review-card">
            <div className="reviewer-name">{review.User?.firstName || "Anonymous"}</div>
            <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
            <div className="review-text">{review.review}</div>
            {sessionUser && sessionUser.id === review.userId && (
               <OpenModalButton
                  buttonText="Delete"
                  buttonClassName="delete-review-button"
                  modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
               />
            )}
         </div>
      ))
   ) : (
      <p>No reviews yet</p>
   )}
</div>

    </div>
  );

}
  export default SpotDetail;
