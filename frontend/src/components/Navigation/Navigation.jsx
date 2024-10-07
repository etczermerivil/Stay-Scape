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
        <div className="nav-right">
          {isLoaded && sessionUser && <ProfileButton user={sessionUser} />}
          {!sessionUser && isLoaded && (
            <>
              <NavLink to="/login" className="nav-link">Log In</NavLink>
              <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
            </>
          )}
        </div>
      </nav>
    );
  }

export default Navigation;
