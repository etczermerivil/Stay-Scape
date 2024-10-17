// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaRegIdBadge } from 'react-icons/fa'; // Updated icons
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const handleManageSpots = () => {
    closeMenu();
    navigate('/manage-spots');
  };

  const handleManageReviews = () => {
    closeMenu();
    navigate('/manage-reviews');
  };

  return (
    <div className="profile-button-container">
      <button onClick={toggleMenu}>
        <FaUserCircle size={24} />
      </button>
      <ul className={`profile-dropdown ${showMenu ? '' : 'hidden'}`} ref={ulRef}>
        {user ? (
          <>
            <li>
              <FaUserCircle style={{ marginRight: '8px' }} />
              {user.username}
            </li>
            <li>
              <FaRegIdBadge style={{ marginRight: '8px' }} /> {/* Different icon */}
              {user.firstName} {user.lastName}
            </li>
            <li onClick={handleManageSpots}>
              <button className="action-link">Manage Spots</button>
            </li>
            <li onClick={handleManageReviews}>
              <button className="action-link">Manage Reviews</button>
          </li>
            <li onClick={logout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Log Out
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
