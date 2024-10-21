import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import SpotList from './components/SpotList/SpotList';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import SpotDetail from './components/SpotDetail/SpotDetail';
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage';
import LandingPage from './components/LandingPage/LandingPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Check if the user is the demo user based on username
  const isDemoUser = sessionUser?.username === 'Demo-lition';
  const greetingName = isDemoUser ? 'Guest' : sessionUser?.firstName;

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <header>
        <h1>{sessionUser ? `Welcome, ${greetingName}!` : "Welcome!"}</h1>
      </header>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },  // Landing page added
      { path: '/spots', element: <SpotList /> },  // List of all spots
      { path: '/create-spot', element: <CreateSpotForm /> },  // Form to create new spot
      { path: '/spots/:spotId', element: <SpotDetail /> },  // Specific spot details
      { path: '/manage-spots', element: <ManageSpotsPage /> },  // Manage spots
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
