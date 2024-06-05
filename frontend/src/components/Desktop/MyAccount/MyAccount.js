/*
  Component Description:
  This component represents the My Account page, which allows users to view and edit their profile information as well as access their saved summaries.

  Dependencies:
  None

  Props:
  None

  State:
  - isEditActive: State variable to manage the active tab (Edit Profile or Saved Summaries).
  - user: State variable to store user data fetched from local storage.

  Hooks:
  - useEffect: Used for performing side effects when the component mounts.
  - useState: Used for managing state within the component.

  Functions:
  - switch2Notes: Function to switch to the Saved Summaries tab.
  - switch2Edit: Function to switch to the Edit Profile tab.
*/

import React, { useEffect, useState } from 'react';
import './MyAccount.css';
import EditProfile from './EditProfile/EditProfile';
import SavedNotes from './SavedNotes/SavedNotes';

function MyAccount() {
    const [isEditActive, setIsEditActive] = useState(true);
    const [user, setUser] = useState({});

    const switch2Notes = () => {
        setIsEditActive(false);
    };

    const switch2Edit = () => {
        setIsEditActive(true);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);

    return (
        <div className='myAccount_main'>
            <div className='myAccount_container'>
                <div className='myAccount_header'>
                    <div className='myAccount_header_title'>
                        <p>My Account</p>
                    </div>
                    <div className='myAccount_header_tabs'>
                        <div className={isEditActive ? 'myAccount_header_tabs_tab myAccount_header_tabs_tab_active' : 'myAccount_header_tabs_tab'} onClick={switch2Edit}>
                            <p>Edit Profile</p>
                        </div>
                        <div className={!isEditActive ? 'myAccount_header_tabs_tab myAccount_header_tabs_tab_active' : 'myAccount_header_tabs_tab'} onClick={switch2Notes}>
                            <p>Saved Summaries</p>
                        </div>
                    </div>
                </div>
                <div className='myAccount_content'>
                    {isEditActive ? <EditProfile user={user} /> : <SavedNotes />}
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
