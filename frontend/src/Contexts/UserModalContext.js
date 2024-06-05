/*
  Component Description:
  This component defines a context and provider for managing the state of a user modal. It provides functions to open and close the user modal.

  Functions:
  - openUserModal(): Sets the state to indicate that the user modal should be open.
  - closeUserModal(): Sets the state to indicate that the user modal should be closed.
*/

import React, { createContext, useState } from 'react';

export const UserModalContext = createContext();

export const UserModalProvider = ({ children }) => {

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const openUserModal = () => {
        setIsUserModalOpen(true);
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
    };

    return (
        <UserModalContext.Provider value={{ isUserModalOpen, openUserModal, closeUserModal }}>
            {children}
        </UserModalContext.Provider>
    );
};
