/*
  Component Description:
  This component represents the navbar of the application, which includes the title/logo, user profile icon, and user modal for user-related actions.

  Dependencies:
  - react-router-dom: Used for navigation within the application.

  Props:
  None

  State:
  - user: State variable to store user data fetched from local storage.
  - open: State variable to manage the visibility of the user modal.

  Hooks:
  - useEffect: Used for performing side effects when the component mounts.
  - useState: Used for managing state within the component.

  Functions:
  - handleClose: Function to close the user modal.
  - handleOpen: Function to open the user modal.
  - handleToggle: Function to toggle the visibility of the user modal.
  - closeUserModal: Function to close the user modal if it is open.
  - go2Home: Function to navigate to the home page ("/vr/123").
*/

import React, { useEffect, useState } from 'react';
import './Navbar.css';
import UserModal from '../../Modals/UserModal';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const Navigate = useNavigate();
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const closeUserModal = () => {
        if (open) {
            setOpen(false);
        }
    };

    const go2Home = () => {
        Navigate('/vr/123');
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);

    return (
        <div className='navbar_main' onClick={(e) => { closeUserModal(e) }}>
            <div className='navbar_title'>
                <p onClick={go2Home}>NotivAI</p>
            </div>
            {open && <UserModal closeUserModal={closeUserModal} />}
            <div className='navbar_user'>
                <div className='navbar_user_icon' onClick={handleToggle}>
                    {user.photoUrl === '' ? <div className='userIcon2'>{user.name[0]}</div> : <img src={user.photoUrl} alt='user icon' className='userIcon' />}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
