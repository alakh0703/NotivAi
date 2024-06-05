/*
  Component Description:
  This component renders the entry point for the application, displaying either the login or registration form based on user interaction.

  Dependencies:
  - react-responsive: Used for detecting mobile devices.
  - Login: Component for rendering the login form.
  - Register: Component for rendering the registration form.
  - react-router-dom: Used for navigation within the application.

  Props:
  None

  State:
  - isLogin: Boolean state to determine whether the login form should be displayed.

  Hooks:
  - useEffect: Used for handling side effects, such as redirecting the user if already logged in.
  - useNavigate: Hook for navigation within the application.
  - useMediaQuery: Hook for detecting the device's screen size.

  Functions:
  None
*/

import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import './Entry.css';
import Login from './Login';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

function Entry() {
    const Navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [isLogin, setIsLogin] = React.useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            Navigate('/vr/' + user.uid);
            return;
        }
    }, []);

    return (
        <div className='entry_main'>
            {!isMobile && (
                <div className='entry_left'>
                    <div className='entry_left_content'>
                        <h1 className='entry_title'>NotivAi</h1>
                        <p className='entry_subtitle'>Transcribe, Summarize, Succeed: Your Video, Your Way.</p>
                    </div>
                </div>
            )}
            <div className={`entry_right ${isLogin ? 'login' : 'register'}`}>
                {isLogin ? (
                    <Login register={setIsLogin} />
                ) : (
                    <Register login={setIsLogin} />
                )}
            </div>
        </div>
    );
}

export default Entry;
