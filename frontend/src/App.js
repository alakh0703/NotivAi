/*
  Component Description:
  This component is the main entry point of the application. It sets up routing using React Router and defines routes for different pages.

  Dependencies:
  - react-dom/client: Used for creating a root for the React application.
  - react-router-dom: Used for routing in the application.

  Pages:
  - Entry: Landing page of the application.
  - Desktop: Main desktop interface of the application.
  - Main: Main content area of the desktop interface.
  - Navbar: Navigation bar component for the desktop interface.
  - MyAccount: Page for managing user account settings.
  - Result: Page for displaying results.

  Routes:
  - '/' route: Renders the Entry component.
  - '/vr/:userId' route: Renders the Desktop component with child routes.
    - 'index' route: Renders the Main component.
    - '/my-account' route: Renders the MyAccount component.
    - '/result' route: Renders the Result component.
*/

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import Entry from './components/Entry/Entry';
import Desktop from './components/Desktop/Desktop';
import Main from './components/Desktop/Main/Main';
import MyAccount from './components/Desktop/MyAccount/MyAccount';
import Result from './components/Result/Result';

// Creating the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Entry />,
  },
  {
    path: '/vr/:userId',
    element: (<Desktop />),
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'my-account',
        element: <MyAccount />,
      },
      {
        path: 'result',
        element: <Result />,
      }
    ]
  },
]);

// Main App component
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
