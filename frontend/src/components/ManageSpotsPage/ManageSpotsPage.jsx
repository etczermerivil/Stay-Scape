import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';
// import UpdateSpotButton from "./UpdateSpotButton";
import DeleteSpotModal from "./DeleteSpotModal";
import { getCurrentUserSpots } from "../../store/spot";
import EditSpotModal from './EditSpotModal';
import './ManageSpotsPage.css';


const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userSpots = useSelector((state) => state.spots.UserSpots);

    useEffect(() => {
      dispatch(getCurrentUserSpots());
    }, [dispatch]);

    if (!userSpots || Object.keys(userSpots).length === 0) {
      return <div>No spots available</div>;
    }

    return (
        <div className="manage-spots-page-container">
          <h1>Manage Your Spots</h1>
          <div className="all-spots-container">
          {Object.values(userSpots).map((spot) => {
            const previewImage = spot.previewImage ? spot.previewImage : "/path_to_placeholder_image.jpg";  // Placeholder

            return (
              <div key={spot.id} className="spot-card">
                <img
                  src={previewImage}
                  alt={spot.name}
                  className="spot-image"
                />
                <h2>{spot.name}</h2>
                <p>{spot.city}, {spot.state}</p>
                <p>${spot.price} / night</p>

                <div className="spot-actions">
                  <OpenModalButton
                    buttonText="Delete"
                    buttonClassName="delete-button"
                    modalComponent={<DeleteSpotModal spotId={spot.id} navigate={navigate} />}
                  />
                  <OpenModalButton
                    buttonText="Edit"
                    buttonClassName="edit-button"
                    modalComponent={<EditSpotModal spot={spot} />}
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
