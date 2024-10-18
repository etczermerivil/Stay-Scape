import React from 'react';

const DeleteSpotModal = ({ spot, closeModal }) => {
  const handleDelete = () => {
    // Logic for deleting the spot (e.g., sending a DELETE request)
    closeModal();
  };

  return (
    <div className="modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete the spot "{spot.name}"?</p>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={closeModal}>No</button>
    </div>
  );
};

export default DeleteSpotModal;
