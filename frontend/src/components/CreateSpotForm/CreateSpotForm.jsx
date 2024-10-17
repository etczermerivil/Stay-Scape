import { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { createSpot } from '../../store/spot';
import { useNavigate } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';

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
  const sessionUser = useSelector((state) => state.session.user);

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  console.log("Session User:", sessionUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!sessionUser) {
      console.error("User must be logged in to create a spot.");
      setErrors({ user: "You must be logged in to create a spot." });
      return;
    }

    // Prevent submission if already submitting
    if (isSubmitting) return;
    setIsSubmitting(true);

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setErrors({
        lat: isNaN(parsedLat) ? 'Latitude must be a valid number' : undefined,
        lng: isNaN(parsedLng) ? 'Longitude must be a valid number' : undefined,
      });
      setIsSubmitting(false);
      return;
    }

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

    try {
      const createdSpot = await dispatch(createSpot(newSpot));
      if (createdSpot && createdSpot.id) {
        for (const url of imageUrls) {
          if (url) {
            console.log(`Uploading image: ${url} for spotId: ${createdSpot.id}`);
            await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: { url, preview: true },
            });
          }
        }
        navigate(`/spots/${createdSpot.id}`);
      }
    } catch (error) {
      console.error("Error creating spot or uploading images:", error);
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
