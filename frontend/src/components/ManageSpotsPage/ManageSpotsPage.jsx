import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import UpdateSpotButton from "./UpdateSpotButton";
import DeleteSpotModal from "./DeleteSpotModal";
import { getCurrentUserSpots } from "../../store/spot";
import './ManageSpotsPage.css';


const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const userSpots = useSelector((state) => state.spots.UserSpots);  // Ensure UserSpots exists in your state

    console.log("User spots data:", userSpots);

    useEffect(() => {
      dispatch(getCurrentUserSpots());
    }, [dispatch]);

    // Ensure userSpots is an object and has keys to iterate
    if (!userSpots || Object.keys(userSpots).length === 0) {
      return <div>No spots available</div>;
    }

    // const placeholderImage = "/images/placeholder.jpg"; // Define your placeholder path

return (
  <div className="manage-spots-page-container">
    <h1>Manage Your Spots</h1>
    <div className="all-spots-container">

    {Object.values(userSpots).map((spot) => {
  const previewImage = spot.SpotImages.length > 0 ? spot.SpotImages[0].url : "path_to_placeholder_image.jpg";  // Check for the first image

  return (
    <div key={spot.id} className="spot-card">
      <img
        src={previewImage}  // Use the first image or a placeholder if none
        alt={spot.name}
        className="spot-image"
      />
      <h2>{spot.name}</h2>
      <p>{spot.city}, {spot.state}</p>
      <p>${spot.price} / night</p>

      <div className="spot-actions">
        <UpdateSpotButton spot={spot} />  {/* Button to trigger edit */}
        <OpenModalButton
          buttonText="Delete"
          buttonClassName="delete-button"
          modalComponent={<DeleteSpotModal spotId={spot.id} />}  // Modal to confirm deletion
        />
      </div>
    </div>
  );
})}



    </div>
  </div>
);
};


  export default ManageSpotsPage;