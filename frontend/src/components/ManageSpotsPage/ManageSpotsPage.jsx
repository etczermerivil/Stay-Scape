import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import UpdateSpotButton from "./UpdateSpotButton";
import DeleteSpotModal from "./DeleteSpotModal";
import { getCurrentUserSpots } from "../../store/spot";
import './ManageSpotsPage.css';


const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userSpots = useSelector((state) => state.spots.UserSpots);
    console.log(userSpots);

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

//   const previewImage = spot.SpotImages && Array.isArray(spot.SpotImages) && spot.SpotImages.length > 0
//   ? spot.SpotImages[0].url
//   : "path_to_placeholder_image.jpg";  // Use placeholder if no images exist

  const previewImage = spot.previewImage  // Now using previewImage directly
  ? spot.previewImage
  : "path_to_placeholder_image.jpg";  // Fallback to a placeholder if no image exists

console.log("Using previewImage:", previewImage);  // For debugging

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
            modalComponent={<DeleteSpotModal spotId={spot.id} navigate={navigate} />}  // Pass the navigate function as a prop
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
