import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars } from '@fortawesome/free-solid-svg-icons'

import './Navbar.css'

library.add(faSpinner, faFireAlt, faGrinHearts, faGrinStars, faCloudRain, faBolt, faFireAlt, fab);

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <ul className="nav-link">
            <li><a href="/">Explore</a></li>
            <li><a href="/">Activities</a></li>
            <li><Link to="/lokalsforbusiness">For Business</Link></li>
          </ul>
          <h1 className="app-name">L<span><FontAwesomeIcon icon="fire-alt" className="icon"/></span>KALS</h1>
          <ul className="auth-link">
            <li><a href="/">Log In</a></li>
            <li><Link to="/sign-up" className="sign-up">Sign up</Link></li>
          </ul>
        </header>
      </div>
    )
  }
}
