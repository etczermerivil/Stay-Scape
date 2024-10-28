import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';

import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import SpotList from './components/SpotList/SpotList';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import SpotDetail from './components/SpotDetail/SpotDetail';
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';

import './components/Styles/Global.css';

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current path
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Only show Navigation if the current path is not '/intro'
  const showNavigation = location.pathname !== '/intro';

  return (
    <>
      {showNavigation && <Navigation isLoaded={isLoaded} />} {/* Conditionally render Navigation */}
      <header>
        {/* Header content if needed */}
      </header>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/intro', element: <HomePage /> },  // Home page with video background
      { path: '/', element: <LandingPage /> },  // Landing page
      { path: '/spots', element: <SpotList /> },  // All spots
      { path: '/create-spot', element: <CreateSpotForm /> },  // Create new spot
      { path: '/spots/:spotId', element: <SpotDetail /> },  // Spot details
      { path: '/manage-spots', element: <ManageSpotsPage /> },  // Manage spots

      // { path: '/', element: <LandingPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
