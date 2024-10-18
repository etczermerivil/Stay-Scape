import { useDispatch } from "react-redux";
import { removeSpot } from "../../store/spot";  // Import the removeSpot action to handle deletion

const DeleteSpotModal = ({ spot, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // Dispatch the removeSpot action with the spot ID
      await dispatch(removeSpot(spot.id));
      closeModal();  // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Confirm Delete</h2>
      {/* Escape quotes and dynamically display the spot name */}
      <p>Are you sure you want to delete the spot &quot;{spot.name}&quot;?</p>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={closeModal}>No</button>
    </div>
  );
};

export default DeleteSpotModal;
