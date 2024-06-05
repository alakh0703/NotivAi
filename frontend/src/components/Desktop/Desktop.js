/*
  Component Description:
  This component renders the desktop view of the application, including the navbar and different routes for Main, MyAccount, and Result pages.

  Dependencies:
  - react-router-dom: Used for routing within the application.
  - ResultProvider: Context provider for managing state related to result data.

  Props:
  None

  State:
  None

  Hooks:
  None

  Functions:
  None
*/

import React from 'react';
import './Desktop.css';
import Navbar from './Navbar/Navbar';
import { Routes, Route } from "react-router-dom";
import Main from './Main/Main';
import MyAccount from './MyAccount/MyAccount';
import Result from '../Result/Result';
import { ResultProvider } from '../../Contexts/ResultProvider';
function Desktop() {
    return (
        <div className='desktop_main'>
            <Navbar />
            <ResultProvider>
                <Routes>
                    <Route
                        index
                        element={<Main />}
                    />
                    <Route
                        path="my-account"
                        element={<MyAccount />}
                    />
                    <Route
                        path="result"
                        element={<Result />}
                    />
                </Routes>
            </ResultProvider>
        </div>
    )
}

export default Desktop;
