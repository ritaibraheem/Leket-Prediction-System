import React from "react";
import { useNavigate } from "react-router-dom";

// Defining a React functional component called Connecting
export const Connecting = () => {
  // Using the useNavigate hook from react-router-dom to get the navigation function
  const navigate = useNavigate();

  return (
    <div>
      {/* This div contains the main content of the Connecting page */}
      <div className="ConnectingPage">
        {/* 
          This form contains the content of the Connecting page. It allows users to sign in or sign up.
        */}
        <form className="Connectin-Form">
          {/* Page title */}
          <h1 className="h1-Connecting">Connecting</h1>
          {/* Page sub-title */}
          <span className="Span1">to Leket's prediction system</span>
          {/* 
            Button to navigate to the Login page when clicked.
            When the user clicks this button, it triggers the navigate function to take them to the "/Login" route.
          */}
          <button className="link-btn1" onClick={() => navigate("/Login")}>
            SIGN IN
          </button>
          {/* 
            Button to navigate to the Register page when clicked.
            When the user clicks this button, it triggers the navigate function to take them to the "/Register" route.
          */}
          <button className="link-btn2" onClick={() => navigate("/Register")}>
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};
