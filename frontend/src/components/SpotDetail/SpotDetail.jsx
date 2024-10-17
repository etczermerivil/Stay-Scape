import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotById } from '../../store/spot';
import './SpotDetail.css';
import { MdStarRate } from 'react-icons/md';
import { LuDot } from 'react-icons/lu';

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(fetchSpotById(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  return (
    <div className="spot-details-container">
      <h2 className="spot-title">{spot.name}</h2>
      <h3 className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </h3>

      <div className="spot-images-container">
        {spot.imageUrls && spot.imageUrls.length > 0 ? (
          <>
            <img src={spot.imageUrls[0]} alt="Spot Preview" className="preview-image" />
            <div className="smaller-images">
              {spot.imageUrls.slice(1).map((url, idx) => (
                <img key={idx} src={url} alt={`Spot Image ${idx + 1}`} className="spot-image" />
              ))}
            </div>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="description-price-container">
        <div className="description-container">
          <h3>Hosted by Demo User</h3>
          <p className="spot-description">{spot.description}</p>
        </div>
        <div className="price-container">
          <div className="price-details">
            <h3>${spot.price} / night</h3>
            <div>
              <MdStarRate /> {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'} <LuDot /> {spot.numReviews} review{spot.numReviews !== 1 ? 's' : ''}
            </div>
          </div>
          <button className="reserve-button">Reserve</button>
        </div>
      </div>

      <hr />

      <div className="reviews-container">
        <h3>Reviews</h3>
        {/* Render reviews here */}
        <div className="review-card">
          <div className="reviewer-name">Reviewer Name</div>
          <div className="review-date">June 14, 2024</div>
          <div className="review-text">Review content here</div>
        </div>
      </div>
    </div>
  );
}

export default SpotDetail;
