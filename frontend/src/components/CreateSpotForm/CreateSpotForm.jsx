import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spot';
import { useNavigate } from 'react-router-dom';

import './CreateSpotForm.css';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('United States');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if already submitting
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Explicitly parse lat and lng as numbers
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    console.log("Parsed Latitude:", parsedLat);
    console.log("Parsed Longitude:", parsedLng);

    // Check if lat or lng are NaN and stop here if they are
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setErrors({
        lat: isNaN(parsedLat) ? 'Latitude must be a valid number' : undefined,
        lng: isNaN(parsedLng) ? 'Longitude must be a valid number' : undefined,
      });
      setIsSubmitting(false);
      return;
    }

    // Build the newSpot object with all properties
    const newSpot = {
      address,
      city,
      state,
      country,
      lat: parsedLat,
      lng: parsedLng,
      name,
      description,
      price: parseFloat(price),
    };

    console.log("New Spot Data:", newSpot);

    try {
      const createdSpot = await dispatch(createSpot(newSpot));
      if (createdSpot && createdSpot.id) {
        // Use navigate instead of history.push
        navigate(`/spots/${createdSpot.id}`);
      }
    } catch (error) {
      console.error("Error creating spot:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          value={lat}
          onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : '')}
          required
        />
        {errors.lat && <p className="error">{errors.lat}</p>}
      </label>

      <label>
        Longitude
        <input
          type="number"
          step="0.000001"
          value={lng}
          onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : '')}
          required
        />
        {errors.lng && <p className="error">{errors.lng}</p>}
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
