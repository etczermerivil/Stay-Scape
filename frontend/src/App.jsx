// frontend/src/App.jsx

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
// import OpenModalButton from './components/OpenModalButton/OpenModalButton'; // Import OpenModalButton
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {/* Render Navigation bar on all pages */}
      <Navigation isLoaded={isLoaded} />
      {/* Conditionally render Outlet only after user restoration */}
      {isLoaded && <Outlet />}

      {/* Add the OpenModalButton here to test the modal */}
      {/* <OpenModalButton
        buttonText="Open Test Modal"
        modalComponent={<h2>Hello, this is a test modal!</h2>}
        onButtonClick={() => console.log('Button clicked!')}
        onModalClose={() => console.log('Modal closed!')}
      /> */}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <h1>Welcome!</h1> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
