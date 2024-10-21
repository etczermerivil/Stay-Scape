import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session'; // Import session reducer
import spotReducer from './spot'; // Import spot reducer
import reviewReducer from './review'; // Import review reducer (add this)

// Combine all reducers into rootReducer
const rootReducer = combineReducers({
  session: sessionReducer,  // Add the session reducer here
  spots: spotReducer,  // Add the spot reducer here
  reviews: reviewReducer,  // Add the review reducer here (new)
  // Add other reducers here if needed
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
