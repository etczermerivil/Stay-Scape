import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSpotThunk } from '../../store/spot';  // Import updateSpot action
import useModal from '../../context/useModal';
import './EditSpotModal.css';

const EditSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // Pre-populate form with existing spot data
  const [address, setAddress] = useState(spot.address || '');
  const [city, setCity] = useState(spot.city || '');
  const [state, setState] = useState(spot.state || '');
  const [country, setCountry] = useState(spot.country || '');
  const [lat, setLat] = useState(spot.lat || '');
  const [lng, setLng] = useState(spot.lng || '');
  const [description, setDescription] = useState(spot.description || '');
  const [name, setName] = useState(spot.name || '');
  const [price, setPrice] = useState(spot.price || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSpot = {
      ...spot,
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      name,
      price,
    };

    await dispatch(updateSpotThunk(updatedSpot));  // Dispatch the correct action
    closeModal();  // Close the modal afterward
  };

  return (
    <div className="edit-spot-modal modal-content">
      <h1>Edit Your Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"  // Allow for decimal prices
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditSpotModal;
