/*
  Component Description:
  This component renders the registration form for creating a new user account. It allows users to register using their email and password or Google account.

  Dependencies:
  - react-loader-spinner: Used for displaying loading spinner.
  - AuthProvider: Context for managing user authentication.
  - Firebase: Used for user authentication and profile management.

  Props:
  None

  State:
  - isLoading: Boolean state to track the loading status of registration.

  Refs:
  - nameRef: Reference to the name input field.
  - emailRef: Reference to the email input field.
  - passwordRef: Reference to the password input field.
  - confirmPasswordRef: Reference to the confirm password input field.

  Functions:
  - switchToggle(): Toggles between login and registration forms.
  - handleRegister(): Handles user registration with email and password.
  - handleGoogleRegister(): Handles user registration with Google account.
  - handleEmailRegister(email, password): Registers a user with email and password.
*/
import React, { useRef } from 'react';
import { Circles } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import './Register.css';

import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";

import { useAuth } from '../../Contexts/AuthProvider';

// internal imports
import googleIcon from '../../assets/images/google.svg';


function Register(props) {
    const Navigate = useNavigate();
    const { user, login, logout } = useAuth()
    const nameRef = useRef('')
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const confirmPasswordRef = useRef('')

    const [isLoading, setIsLoading] = React.useState(false)

    const switchToggle = () => {
        props.login(true)
    }

    const handleRegister = () => {
        setIsLoading(true);

        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Please fill all the fields');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            setIsLoading(false);
            return;
        }

        alert('Registering user');

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                updateProfile(user, { displayName: name })
                    .then(() => {
                        console.log('User profile updated successfully');

                        const userData = {
                            name: name,
                            email: email,
                            accessToken: user.accessToken,
                            photoUrl: '',
                            verified: false,
                            uid: user.uid,
                        };

                        login(userData);
                        Navigate('/vr/' + user.uid)

                    })
                    .catch((error) => {
                        console.error('Error updating user profile:', error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);
                if (errorCode === 'auth/email-already-in-use') {
                    alert('Email already in use');
                    setIsLoading(false);
                }
            });
    };

    const handleEmailRegister = async (email, password) => {

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert('User registered successfully')
                // Signed up 
                console.log(userCredential)
                const user = userCredential.user;
                console.log(user)
                setIsLoading(false)
                // ...
            })
            .catch((error) => {
                alert('Error registering user')
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                setIsLoading(false)
                // ..
            });

    }


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
                }
                login(user)
                Navigate('/vr/' + result.user.uid)
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential)
            });
    }

    return (
        <div className='register_main'>
            <div className='register_title'>
                <p>Create Account</p>
            </div>
            <div className='register_google'>
                <div className='register_google_icon'>
                    <img src={googleIcon} alt='google icon' className='googleIcon' onClick={handleGoogleRegister} />
                </div>
                <p className='register_google_p1'>or use your account</p>
            </div>
            <div className='register_self_form'>
                <input type='text' placeholder='Name' className='register_self_form_input' ref={nameRef} />
                <input type='text' placeholder='Email' className='register_self_form_input' ref={emailRef} />
                <input type='password' placeholder='Password' className='register_self_form_input' ref={passwordRef} />
                <input type='password' placeholder='Confirm Password' className='register_self_form_input' ref={confirmPasswordRef} />
                <div className='register_self_form_button_div'>
                    {isLoading ? <Circles
                        height="25"
                        width="25"
                        color="orange"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    /> : <button className='register_self_form_button' onClick={handleRegister}>Register</button>}
                </div>
            </div>
            <div className='register_register'>
                <p className='register_register_p1'>Already have an account ? <span className='register_register_span1' onClick={switchToggle}>Login</span></p>
            </div>
        </div>
    )
}

export default Register