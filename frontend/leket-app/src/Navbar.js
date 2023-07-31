import React from 'react';
import logowithoutbackground from "./assets/images/logowithoutbackground.png"

// Navbar component represents the navigation bar at the top of the page
function Navbar() {
  return (
    <nav className='nav'>
      {/* The logo of the website */}
      <img src={logowithoutbackground} alt=" image leket" height={'50'} width={'80'}></img>
      
      {/* Site title (currently empty, you can add a text if needed) */}
      <a className="site-title"></a>
      
      {/* List of navigation links */}
      <ul>
        {/* Link to the "Main" page */}
        <li><a href="/Main">Main</a></li>
        
        {/* Link to the "Signout" page */}
        <li><a href="/Signout">Sign Out</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
