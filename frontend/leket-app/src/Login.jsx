import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import image1 from "./assets/images/image7.jpeg"

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('//localhost:4000/users/Login', {
       email :email,
        password:password })
      .then(response => {
        console.log(response.data);
        alert('User Login successfully!');
            navigate("/Main"); // navigate to success page
        // TODO: Handle the successful login, e.g. by redirecting to the user's dashboard
      })
      .catch(error => {
        console.error(error);
            // show error message to the user here
            alert('Error Login user. Please try again later.');
      });
  };

  return (
    <div className="login-page">
      {/* <Navbar className='nav'/> */}
      <div className="wrapper2">
      <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <p>
            <h1 className="h1-login">SIGN IN</h1>
            <h4 className="h4">Please enter your details</h4>
          </p>

          <label className ='label3' htmlFor="email"> Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
          <label className= 'label3' htmlFor="password">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="****" id="password" name="password" />
          {/* <input type="checkbox" id="rememberMe" name="rememberMe"/> */}
          {/* <label htmlFor="rememberMe">Remember me</label> */}
          <button className="without-back-button" type="forget_password">Forgot Password?</button>
          <button className="black-login-button" type="submit">Log In</button>
        </form>
        <button className="without-back-button-signup" onClick={() => navigate("/Register")}>Don't have an account? Sign Up!</button>
      </div>
      </div>
      
      
      {/* <div class="container">
  <div class="image"></div>
</div> */}
    </div>
  );
};