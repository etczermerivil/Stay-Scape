import { useDispatch } from "react-redux";
import { removeSpot, fetchSpots } from '../../store/spot';
import useModal from '../../context/useModal';
import { getCurrentUserSpots } from "../../store/spot";

const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();  // Use custom modal hook

  const handleDelete = async () => {
    console.log("Deleting spot with ID:", spotId);

    await dispatch(removeSpot(spotId));
    await dispatch(getCurrentUserSpots());
    await dispatch(fetchSpots());
    closeModal();
  };

  // const handleDelete = async () => {
  //   console.log("Deleting spot with ID:", spotId);  // Add this log to check the spotId
  //   await dispatch(removeSpot(spotId));  // Dispatch the action to delete the spot
  //   navigate('/manage-spots');
  // };

  return (
    <div className="delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this spot?</p>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={closeModal}>No</button>  {/* Close modal */}
    </div>
  );
};

export default DeleteSpotModal;
