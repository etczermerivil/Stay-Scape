import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spot'; // This should fetch all spots
import { useNavigate } from 'react-router-dom';
import { MdStarRate } from 'react-icons/md'; // Import the star icon
import './LandingPage.css'; // Adjust styling

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.Spots); // Grabbing all spots from the store

  useEffect(() => {
    dispatch(fetchSpots()); // Fetch all spots on component mount
  }, [dispatch]);

  if (!spots || Object.keys(spots).length === 0) {
    return <div>No spots available</div>;
  }

  // This function is now used and sets the onClick for each image
  const handleImageClick = (spotId) => {
    navigate(`/spots/${spotId}`); // Navigate to spot's detail page
  };

  return (
    <div className="landing-page-container">
      <h1>Explore Spots</h1>
      <div className="all-spots-container">

      {Object.values(spots).map((spot) => {
        const previewImage = spot.previewImage || '/path_to_placeholder_image.jpg';  // Use placeholder if no image
        const avgRating = typeof spot.avgRating === 'number' ? spot.avgRating.toFixed(1) : "New";
        const reviewsCount = spot.numReviews || 0;

        return (
          <div key={spot.id} className="spot-card">
            <img
              src={previewImage}  // Using previewImage correctly here
              alt={spot.name}
              className="spot-image"
              onClick={() => handleImageClick(spot.id)}  // Now using handleImageClick
              style={{ cursor: 'pointer' }}
            />

            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} / night</p>

            {/* Add rating stars */}
            <div className="rating">
              <MdStarRate className="star" /> {avgRating}
              {reviewsCount > 0 && (
                <span> • {reviewsCount} review{reviewsCount !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default LandingPage;
