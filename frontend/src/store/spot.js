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

export const createSpot = (spot) => async (dispatch) => {
  const response = await fetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }
};

export const editSpot = (spot) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  }
};

export const removeSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteSpot(spotId));
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
      const newStateAfterDelete = { ...state };
      delete newStateAfterDelete[action.spotId];
      return newStateAfterDelete;
    }
    default:
      return state;
  }
}
