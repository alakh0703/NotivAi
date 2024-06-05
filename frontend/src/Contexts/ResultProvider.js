/*
  Component Description:
  This component defines a context and provider for managing the state of result data, including summary, transcript, and notes.

  Functions:
  - updateContextValue(newContextValue): Updates the context value with the provided data.

  Initial State:
  - summary: Contains the summary of the result.
  - transcript: Contains the transcript of the result.
  - notes: Contains additional notes related to the result.
*/

import React, { createContext, useState } from 'react';

export const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
    // State variable to hold the context value
    const [contextValue, setContextValue] = useState({
        summary: 'summary of the result will be here',
        transcript: 'transcript of the result will be here',
        notes: '',
    });

    // Function to update the context value
    const updateContextValue = (newContextValue) => {
        setContextValue(newContextValue);
    };

    // Providing the state and function to children components via context
    return <ResultContext.Provider value={{ contextValue, updateContextValue }}>{children}</ResultContext.Provider>;
};
