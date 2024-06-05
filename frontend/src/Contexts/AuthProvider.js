/*
  Component Description:
  This component defines a context and provider for managing user authentication state, including login and logout functionality.

  Functions:
  - login(userData): Authenticates the user and sets user data in the state.
  - logout(): Logs out the user and clears user data from the state and local storage.

  Hooks:
  - useAuth(): Custom hook to access the authentication context.

  External Dependencies:
  - Firebase authentication is used for user authentication.

  State:
  - user: Contains user data including name, email, access token, photo URL, verification status, and UID.

  Effects:
  - useEffect(): Retrieves user data from local storage on component mount.

*/

import { signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../utils/Firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        accessToken: '',
        photoUrl: '',
        verified: false,
        uid: '',
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser({
            name: '',
            email: '',
            accessToken: '',
            photoUrl: '',
            verified: false,
            uid: '',
        });
        localStorage.removeItem('user');

        signOut(auth).then(() => {
            window.location.href = '/'
        }).catch((error) => {
            console.log('Error signing out:', error.message)
        });
    };

    const contextValue = {
        user,
        login,
        logout,
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
            return
        }
        setUser(user)
    }, []);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
