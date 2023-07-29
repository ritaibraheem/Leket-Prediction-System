import React from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";
import image5 from "./assets/images/image5.jpeg"

export const Main = () => {
    const navigate = useNavigate();

    return(  
        <div className="Main">
            <Navbar className='nav1'/>
            <form className='Main-Form'>
            <p>
           <h1 className="h1-main">
            Welcome!
           </h1>
           <span className="Span1"> 
            Leket's Prediction System
           </span>
           </p>
            <button className="pred-button" onClick={()=> navigate("/Prediction")}> Start Prediction</button> 
           </form>

        </div> 
    );
};