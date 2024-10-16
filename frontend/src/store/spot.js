import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

// Action Creators
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

// Thunks for asynchronous actions
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data.spots));
  }
};

// store/spot.js
export const createSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;

  console.log("Creating Spot with Data:", { address, city, state, country, lat, lng, name, description, price });

  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {  // Pass as a plain object
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Data:", errorData);
      throw new Error("Failed to create spot");
    }

    const newSpot = await response.json();
    dispatch(addSpot(newSpot)); // Add spot to Redux store
    return newSpot;
  } catch (error) {
    console.error("Request failed:", error);
    return { errors: error.message };
  }
};



export const postSpotImage = (image) => async () => {
  const { spotId, url, preview } = image;

  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, preview }),
  });

  if (response.ok) {
    const newImage = await response.json();
    return newImage;
  } else {
    const errorData = await response.json();
    console.error("Image Upload Error:", errorData);
    return { errors: errorData.errors };
  }
};

export const editSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  } else {
    const errorData = await response.json();
    console.error("Error updating spot:", errorData);
    return { errors: errorData.errors };
  }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
    return spot;
  } else {
    console.error('Failed to fetch spot');
    return null;
  }
};

export const removeSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteSpot(spotId));
  } else {
    const errorData = await response.json();
    console.error("Error deleting spot:", errorData);
  }
};

// Initial State
const initialState = {};

// Reducer
export default function spotReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {};
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case ADD_SPOT: {
      return {
        ...state,
        [action.spot.id]: action.spot,
      };
    }
    case UPDATE_SPOT: {
      return {
        ...state,
        [action.spot.id]: action.spot,
      };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    default:
      return state;
  }
}
