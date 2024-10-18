

const EditSpotModal = ({ spot, closeModal }) => {
  const [formData, setFormData] = useState({ ...spot });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for handling spot updates (e.g., sending a PUT request to update the spot)
    closeModal();
  };

  return (
    <div className="modal">
      <h2>Edit Spot</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields for the spot details, pre-filled with spot data */}
        <label>Spot Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {/* Add other fields similarly */}
        <button type="submit">Update Spot</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
};

export default EditSpotModal;
