import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile_button">
      <button className="menu button" onClick={openMenu}>
      <i class="fa-solid fa-bars fa-2x"></i>
      <i class="fa-solid fa-ghost fa-3x"></i>
      </button >
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <p>Hello, {user.username}</p>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
            <p><Link to="/spots/current">
              <button>
                Manage Spots
              </button>
            </Link>

            </p>
            <a>
              <button onClick={logout}>Log Out</button>
            </a>
          </>
        ) : (
          <div className="login-signup-dropdown">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
