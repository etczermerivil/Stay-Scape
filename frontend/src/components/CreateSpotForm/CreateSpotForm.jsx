import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spot';
import './CreateSpotForm.css';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState('United States');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
  const [errors, setErrors] = useState({});

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate latitude and longitude
    const validationErrors = {};
    if (latitude < -90 || latitude > 90) validationErrors.latitude = 'Latitude must be between -90 and 90.';
    if (longitude < -180 || longitude > 180) validationErrors.longitude = 'Longitude must be between -180 and 180.';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    const spotData = {
      country,
      address,
      city,
      state,
      latitude,
      longitude,
      description,
      name,
      price,
      imageUrls: imageUrls.filter((url) => url !== ''),
    };

    // Log spotData to check what is being sent
    console.log("Spot data being sent to createSpot:", spotData);

    const newSpot = await dispatch(createSpot(spotData));
    if (newSpot) {
      navigate(`/spots/${newSpot.id}`);
    }

    // Reset form fields
    setCountry('United States');
    setAddress('');
    setCity('');
    setState('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setName('');
    setPrice('');
    setImageUrls(['', '', '', '', '']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Hut</h2>

      <label>
        Country
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
      </label>

      <label>
        Address
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </label>

      <label>
        City
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
      </label>

      <label>
        State
        <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
      </label>

      <label>
        Latitude
        <input
          type="number"
          step="0.000001"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        {errors.latitude && <p className="error">{errors.latitude}</p>}
      </label>

      <label>
        Longitude
        <input
          type="number"
          step="0.000001"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        {errors.longitude && <p className="error">{errors.longitude}</p>}
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>

      <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label>
        Price
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>

      <h3>Add Pictures!</h3>
      {imageUrls.map((url, index) => (
        <label key={index}>
          {index === 0 ? 'Preview Image URL' : `Image URL ${index}`}
          <input
            type="text"
            value={url}
            onChange={(e) => handleImageUrlChange(index, e.target.value)}
          />
        </label>
      ))}

      <button type="submit">Create Stay</button>
    </form>
  );
}

export default CreateSpotForm;
