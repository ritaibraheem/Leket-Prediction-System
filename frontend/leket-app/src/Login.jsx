import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Login = (props) => {
  // State variables to hold user input for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle form submission when the user clicks the login button
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a login request to the backend server using Axios
    axios.post('//localhost:4000/users/Login', {
      email: email,
      password: password
    })
    .then(response => {
      console.log(response.data);
      // Display a success message to the user and navigate to the "Main" page
      alert('User Login successfully!');
      navigate("/Main"); // navigate to the "Main" page after successful login
    })
    .catch(error => {
      console.error(error);
      // Display an error message to the user if there's an issue with the login
      alert('Error Login user. Please try again later.');
    });
  };

  return (
    <div className="login-page">
      {/* Navbar component can be included here */}
      <div className="wrapper2">
        <div className="auth-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <p>
              <h1 className="h1-login">SIGN IN</h1>
              <h4 className="h4">Please enter your details</h4>
            </p>

            {/* Input fields for email and password */}
            <label className='label3' htmlFor="email"> Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label className='label3' htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="****" id="password" name="password" />

            {/* TODO: forgetting password is not ready to use. now the user will be able to re-register to the system after deleting manually his data in DB*/}
            <button className="without-back-button" type="forget_password" onClick={() => alert('Ask your manger for help!')} >Forgot Password?</button>

            {/* Button to submit the login form */}
            <button className="black-login-button" type="submit">Log In</button>
          </form>
          
          {/* Button to navigate to the "Register" page for sign up */}
          <button className="without-back-button-signup" onClick={() => navigate("/Register")}>Don't have an account? Sign Up!</button>
        </div>
      </div>
      
      {/* TODO: The following div contains an image element that is not included in the code. */}
      {/* <div class="container">
        <div class="image"></div>
      </div> */}
    </div>
  );
};
