// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <NavLink to="/" className="nav-link">Home</NavLink>
      </div>
      {isLoaded && (
        <div className="nav-right">
          {sessionUser && (
            <NavLink to="/create-stay" className="nav-link create-stay-button">
              Create Your Stay
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
