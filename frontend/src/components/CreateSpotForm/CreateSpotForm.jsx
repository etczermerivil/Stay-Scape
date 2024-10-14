// frontend/src/components/CreateSpotForm/CreateSpotForm.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spot';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSpot({ name, location }));
    setName('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Spot</h2>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Location:
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <button type="submit">Add Spot</button>
    </form>
  );
}

export default CreateSpotForm;
