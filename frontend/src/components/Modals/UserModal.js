/*
  Component Description:
  This component renders a user modal, displaying user information and options to navigate to the user's account or log out.

  Dependencies:
  - lucide-react: Used for the LogOutIcon and UserRound icons.
  - AuthProvider: Context for managing user authentication.

  Props:
  - closeUserModal: Function to close the user modal.

  State:
  - currentUser: State to hold the current user data.

  Functions:
  - handleButtonClick(e): Prevents event propagation to avoid closing the modal when clicking inside it.
  - go2MyAccount(): Redirects the user to the My Account page.
  - logoutHandler(): Logs the user out and closes the modal.

  Hooks:
  - useAuth(): Custom hook to access the authentication context.

  Navigation:
  - useNavigate(): Hook from react-router-dom for programmatic navigation.

*/

import React, { useEffect, useState } from 'react';
import './UserModal.css';
import { LogOutIcon, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthProvider';

function UserModal({ closeUserModal }) {
    const { user, logout } = useAuth();
    const Navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});

    const handleButtonClick = (e) => {
        e.stopPropagation();
    };

    const go2MyAccount = () => {
        Navigate('my-account');
        closeUserModal();
    };

    const logoutHandler = () => {
        logout();
        closeUserModal();
    };

    return (
        <div className='usermodal_main' >
            <div className='usermodal_popup' onClick={handleButtonClick}>
                <div className='usermodal_popup_user'>
                    {user.photoUrl === '' ?
                        <div className='userIcon21'>{user.name[0]}</div> :
                        <img src={user.photoUrl} alt='um_userIcon' className='userIcon' />
                    }
                    <div className='usermodal_popup_user_right'>
                        <p className='usermodal_popup_user_name'>{user.name}</p>
                        <p className='usermodal_popup_user_email'>{user.email}</p>
                    </div>
                </div>
                <div className='usermodal_popup_links'>
                    <div className='usermodal_popup_link' onClick={go2MyAccount}>
                        <p>My Account</p>
                        <UserRound size={16} className='lucide_icon lucide_user' />
                    </div>
                    <div className='usermodal_popup_link' onClick={logoutHandler}>
                        <p>Logout</p>
                        <LogOutIcon size={16} className='lucide_icon lucide_logout' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserModal;
