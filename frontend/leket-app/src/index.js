import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Connecting } from './Connecting';
import { Main } from './Main';
import { Login } from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Register } from './Register';
import { Prediction } from './Prediction';
import { Results } from './Results';
import WebFont from 'webfontloader';

// Create a React root using ReactDOM.createRoot and render the application inside it.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/* The Routes component is used to define the routing of different components based on the URL path */}
    <Routes>
      {/* Route for the Connecting component. This component will be rendered when the path is '/' */}
      <Route path='/' element={<Connecting />} />
      {/* Route for the Main component. This component will be rendered when the path is '/Main' */}
      <Route path='/Main' element={<Main />} />
      {/* Route for the Login component. This component will be rendered when the path is '/Login' */}
      <Route path='/Login' element={<Login />} />
      {/* Route for the Signout component. This component will be rendered when the path is '/Signout' */}
      <Route path='/Signout' element={<Connecting />} />
      {/* Route for the Register component. This component will be rendered when the path is '/Register' */}
      <Route path='/Register' element={<Register />} />
      {/* Route for the Prediction component. This component will be rendered when the path is '/Prediction' */}
      <Route path='/Prediction' element={<Prediction />} />
      {/* Route for the Results component. This component will be rendered when the path is '/Results' */}
      <Route path='/Results' element={<Results />} />
    </Routes>
  </Router>
);

// Load web fonts using WebFont.load
WebFont.load({
  google: {
    families: ['Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700', 'Open Sans', 'Montserrat', 'Inspiration', 'Abril Fatface', 'Shadows Into Light']
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
