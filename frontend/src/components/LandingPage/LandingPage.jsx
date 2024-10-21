import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spot'; // This should fetch all spots
import { useNavigate } from 'react-router-dom';
import { MdStarRate } from 'react-icons/md'; // Import the star icon
// import { LuDot } from 'react-icons/lu';
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
  const previewImage = spot.previewImage || '/path_to_placeholder_image.jpg';

    return (
        <div key={spot.id} className="spot-card">
          <img
            src={previewImage}
            alt={spot.name}
            className="spot-image"
            onClick={() => handleImageClick(spot.id)}
            style={{ cursor: 'pointer' }}
          />
          <h2>{spot.name}</h2>

          {/* Line with city, state, and rating */}
          <div className="spot-info">
            <p className="spot-location">{spot.city}, {spot.state}</p>
            <p className="spot-rating">
              <MdStarRate />
              {spot.avgRating && !isNaN(Number(spot.avgRating)) ? (
                Number(spot.avgRating).toFixed(1)
              ) : (
                "New"
              )}
            </p>
          </div>

          {/* Price aligned to the right */}
          <div className="spot-price">
            <p>${spot.price} / night</p>
          </div>
        </div>
      );

})}


      </div>
    </div>
  );
};

export default LandingPage;
