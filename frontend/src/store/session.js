import { csrfFetch } from './csrf';

// Action Types
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// Action Creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk Action for Signing Up
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Thunk Action for Logging in
export const login = (credential, password) => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Thunk Action for Restoring Session User
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');  // Fetch the current session user
  const data = await response.json();
  dispatch(setUser(data.user));  // Set the session user in the store
  return response;
};

// Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

// Export the reducer as default
export default sessionReducer;
