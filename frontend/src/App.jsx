// frontend/src/App.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import SpotList from './components/SpotList/SpotList';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <header>
        <h1>{sessionUser ? `Welcome, ${sessionUser.firstName}!` : "Welcome!"}</h1>
      </header>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <SpotList /> },         // Route for SpotList component
      { path: '/create-spot', element: <CreateSpotForm /> }, // Route for CreateSpotForm component
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
