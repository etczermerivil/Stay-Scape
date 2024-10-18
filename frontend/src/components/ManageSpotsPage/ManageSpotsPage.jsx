import { useEffect, useState } from 'react';
import useModal from '../../context/useModal';
import EditSpotModal from './EditSpotModal';
import DeleteSpotModal from './DeleteSpotModal';

const ManageSpotsPage = () => {
  const [spots, setSpots] = useState([]); // Ensure spots is initialized as an empty array
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    // Fetch the spots data from your API
    fetch('/api/spots/current') // Replace with your actual API route
      .then(response => response.json())
      .then(data => {
        if (data && data.spots) { // Ensure data is correctly structured
          setSpots(data.spots);
        }
      })
      .catch(err => console.error('Error fetching spots:', err)); // Add error handling
  }, []);

  const handleEdit = (spot) => {
    openModal(<EditSpotModal spot={spot} closeModal={closeModal} />);
  };

  const handleDelete = (spot) => {
    openModal(<DeleteSpotModal spot={spot} closeModal={closeModal} />);
  };

  return (
    <div className="manage-spots-page">
      <h1>Manage Your Spots</h1>
      <div className="spot-list">
        {spots.length > 0 ? ( // Ensure spots is an array before using .length
          spots.map((spot) => (
            <div key={spot.id} className="spot-item">
              <img src={spot.previewImage} alt={spot.name} className="spot-preview-image" />
              <div className="spot-details">
                <h2>{spot.name}</h2>
                <p>{spot.price}/night</p>
              </div>
              <div className="spot-actions">
                <button onClick={() => handleEdit(spot)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(spot)} className="delete-button">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No spots available</p> // Handle case where no spots are available
        )}
      </div>
    </div>
  );
};

export default ManageSpotsPage;
