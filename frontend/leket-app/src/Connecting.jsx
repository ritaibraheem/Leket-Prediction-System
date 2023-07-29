import React from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";


export const Connecting = () => {
    const navigate = useNavigate();

    return(
        <div>
            
        <div className="ConnectingPage">    
        {/* <img src={image1} style={{
        position: 'fixed',
        right: `50px`,
        top: `200px`,
        }} alt = " image 2" height = {'auto'} width={350}></img>
        <img src={image2} style={{
        position: 'fixed',
        right: `870px`,
        top: `130px`,
        }} alt = " image 2" height = {400} width={'auto'}></img>    */}
           <form className='Connectin-Form'>
           <h1 className="h1-Connecting"> Connecting </h1> 
           <span className="Span1">to Leket's prediction system </span>
           <button className="link-btn1" onClick={()=> navigate("/Login")}> SIGN IN</button>
           <button className="link-btn2" onClick={()=> navigate("/Register")}> SIGN UP</button>
           <button className="link-btn3" onClick={()=> navigate("/Main")}>Main</button>  
           </form> 
           
        </div>
        </div>
        
    )
}