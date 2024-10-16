import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotById } from '../../store/spot'; // Import a thunk action to fetch spot details

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(fetchSpotById(spotId)); // Fetch the spot details when the component loads
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  return (
    <div>
      <h1>{spot.name}</h1>
      <p>{spot.address}, {spot.city}, {spot.state}, {spot.country}</p>
      <p>{spot.description}</p>
      <p>Price: ${spot.price}</p>
      <div>
        {spot.imageUrls && spot.imageUrls.map((url, idx) => (
          <img key={idx} src={url} alt={`${spot.name} image ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default SpotDetail;
