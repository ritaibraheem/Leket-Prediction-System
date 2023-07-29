import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Connecting } from './Connecting';
import {Main}  from './Main'
import {Login} from './Login'
import {Signout} from './Signout'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Register } from './Register';
import { Prediction } from './Prediction';
import { Results } from './Results';
import WebFont from 'webfontloader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router> 
    <Routes>
      <Route path='/' element={<Connecting/>} />
      <Route path='/Main' element={<Main/>} />
      <Route path='/Login' element={<Login/>} />
      <Route path='/Signout' element={<Connecting/>} />
      <Route path='/Register' element={<Register/>} />
      <Route path='/Prediction' element={<Prediction/>} />
      <Route path='/Results' element={<Results/>} />
    </Routes>
  </Router>
);

WebFont.load({
  google: {
    families: ['Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700', 'Open Sans', 'Montserrat','Inspiration','Abril Fatface','Shadows Into Light']
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
