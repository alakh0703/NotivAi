/*
  Component Description:
  This component renders the login form allowing users to log in to the application.

  Dependencies:
  - react-loader-spinner: Used for displaying loading spinner.
  - Firebase: Used for authentication.
  - AuthProvider: Context provider for managing user authentication.
  - react-router-dom: Used for navigation within the application.

  Props:
  - register: Function to toggle between login and registration forms.

  State:
  - isLoading: Boolean state to indicate if the login operation is in progress.

  Hooks:
  None

  Functions:
  - showRegisterForm: Function to switch to the registration form.
  - handleLogin: Function to handle user login with email and password.
  - handleGoogleRegister: Function to handle user login with Google account.
*/
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useRef } from 'react';
import { Circles } from 'react-loader-spinner';
import { auth, provider } from "../../utils/Firebase";
import './Login.css';

import { useAuth } from '../../Contexts/AuthProvider';

// images
import { useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/images/google.svg';
function Login({ register }) {
    const Navigate = useNavigate();
    const { login } = useAuth();
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [isLoading, setIsLoading] = React.useState(false);

    const showRegisterForm = () => {
        register(false);
    };

    const handleLogin = () => {
        setIsLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (email === '' || password === '') {
            alert('Please fill all the fields');
            setIsLoading(false);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    accessToken: user.accessToken,
                    photoUrl: '',
                    verified: false,
                    uid: user.uid,
                };

                login(userData);
                Navigate('/vr/' + user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                setIsLoading(false);
            });
    };

    const handleGoogleRegister = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = {
                    name: result.user.displayName,
                    email: result.user.email,
                    accessToken: token,
                    photoUrl: result.user.photoURL,
                    verified: result.user.emailVerified,
                    uid: result.user.uid
                };
                login(user);
                Navigate('/vr/' + result.user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    };

    return (
        <div className='login_main'>
            <div className='login_title'>
                <p>Login</p>
            </div>
            <div className='login_google'>
                <div className='login_google_icon'>
                    <img src={googleIcon} alt='google icon' className='googleIcon' onClick={handleGoogleRegister} />
                </div>
                <p className='login_google_p1'>or use your account</p>
            </div>
            <div className='login_self_form'>
                <input type='text' placeholder='Email' className='login_self_form_input' ref={emailRef} />
                <input type='password' placeholder='Password' className='login_self_form_input' ref={passwordRef} />
                <div className='login_self_form_button_div'>
                    {!isLoading ? (
                        <button className='login_self_form_button' onClick={handleLogin}>Login</button>
                    ) : (
                        <Circles
                            height="25"
                            width="25"
                            color="orange"
                            ariaLabel="circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    )}
                </div>
            </div>
            <div className='login_register'>
                <p className='login_register_p1'>Don't have an account? <span className='login_register_span1' onClick={showRegisterForm}>Register here</span></p>
            </div>
        </div>
    );
}

export default Login;
