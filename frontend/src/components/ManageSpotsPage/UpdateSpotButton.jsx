
import { useNavigate } from 'react-router-dom';

const UpdateSpotButton = ({ spot }) => {
  const navigate = useNavigate();  // Use the `useNavigate` hook

  const handleEdit = () => {
    // Navigate to the edit page for the spot
    navigate(`/spots/${spot.id}/edit`);
  };

  return (
    <button onClick={handleEdit} className="update-spot-button">
      Edit
    </button>
  );
};

export default UpdateSpotButton;
