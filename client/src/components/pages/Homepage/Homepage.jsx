import React from "react";
import { Link } from "react-router-dom";
import './Homepage.scss'

const Homepage = () => {
  return (
    <div className="homeContainer">
      <div className="homeTitle">Online Card Game:
        <div className="title2">Card Jitsu</div>
      </div>
      <div className="menuContainer">
        <div className="menuLinkContainer">  
          <Link to={'/play'}>
            <h1 className="menuLink">Start</h1>
          </Link>
        </div>
        <div className="menuLinkContainer">  
          <Link to={'/instructions'}>
            <h1 className="menuLink">Instructions</h1>
          </Link>
        </div>
        <div className="menuLinkContainer">  
          <Link to={'/credits'}>
            <h1 className="menuLink">Credits</h1>
          </Link>
        </div>
        <div className="menuLinkContainer">  
          <Link to={'/about'}>
            <h1 className="menuLink">About Us</h1>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage