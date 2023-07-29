import React from 'react';
import logowithoutbackground from "./assets/images/logowithoutbackground.png"

function Navbar() {
  return (
    <nav className='nav' >
         <img src={logowithoutbackground} alt = " image leket" height = {'50'} width={'80'}></img>
        <a className="site-title"></a>
        <ul>
          <li><a href="/Main">Main</a></li>
          <li><a href="/Login">Log In</a></li>
          <li><a href="/Signout">Sign Out</a></li>
          
        </ul>
    </nav>
  );
}

export default Navbar;
