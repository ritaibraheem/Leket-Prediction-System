import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Main component represents the main page of the application
export const Main = () => {
  // useNavigate hook to get the navigation function
  const navigate = useNavigate();

  return (
    <div className="Main">
      {/* Include the navigation bar component */}
      <Navbar className='nav1' />

      {/* Main content of the page */}
      <form className='Main-Form'>
        <p>
          {/* Page title */}
          <h1 className="h1-main">
            Welcome!
          </h1>
          {/* Page sub-title */}
          <span className="Span1"> 
            Leket's Prediction System
          </span>
        </p>

        {/* Button to navigate to the "Prediction" page */}
        <button className="pred-button" onClick={() => navigate("/Prediction")}>
          Start Prediction
        </button> 
      </form>
    </div> 
  );
};
