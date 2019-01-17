import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { googleAuth, facebookAuth, emailLogin } from '../actions/authActions';

// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
// import GoogleLogin from 'react-google-login';
// import TextFieldGroup from './reusable/TextFieldGroup';
// import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '../config/keys';

import isEmpty from '../util/is-empty';
import { logoutUser } from '../actions/authActions';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'

import './Navbar.css'

library.add(faFireAlt);

const INITIAL_STATE = {
  email: '',
  password: '',
  loginBarActive: false
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit = (e) => {
    e.preventDefault();
    const cred = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.emailLogin(cred);
    this.showLoginBar();
    this.setState({email: '', password: ''});
  }
  showLoginBar = (e) => {
    if (e) {
      e.preventDefault();
    }
    const isActive = this.state.loginBarActive;
    var loginBar = document.getElementById("lokals-login");
    if (!isActive) {
      loginBar.style.height = "3rem";
    } else {
      loginBar.style.height = 0;
    }
    this.setState({ loginBarActive: !isActive });
  }
  googleResponse = (res) => {
    this.props.googleAuth(res.tokenId);
    this.showLoginBar();
  }
  facebookResponse = (res) => {
    const name = res.name.split(' ');
    const userData = {
      name: {
        first: name[0],
        last: name[1]
      },
      email: res.email,
      facebookAuth:{
        id: res.userID
      },
      imageUrl: res.picture.data.url
    }
    this.props.facebookAuth(userData);
    this.showLoginBar();
  }
  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuth, user } = this.props.auth;
    // const errors = {};
    const guestLinks = (
      <ul className="auth-link">
        {/* <li><button type="button" onClick={this.showLoginBar} className="login-btn">Log In</button></li> */}
        <li><Link to="/login" className="login-btn">Log in</Link></li>
        <li><Link to="/signup" className="signup-btn">Sign up</Link></li>
      </ul>
    );
    const loggedLinks = (
      <ul className="auth-link logged">
        <li className="welcome-user">Welcome, <Link to="/preference" className="preference-link"><strong>{!isEmpty(user.name) && user.name.first}</strong></Link></li>
        <li><button type="button" onClick={this.onLogout} className="logout-btn">Log out</button></li>
      </ul>
    );
    return (
      <div>
        <header className="App-header">
          <div>
          <h1 className="app-name">L<span><FontAwesomeIcon icon="fire-alt" className="icon"/></span>KALS</h1>

            <ul className="nav-link">
              <li><a href="/">Explore</a></li>
              <li><a href="/">Activities</a></li>
              <li><Link to="/lokalsforbusiness">For Business</Link></li>
            </ul>
          </div>
          {isAuth? loggedLinks : guestLinks}
          {/* {guestLinks} */}
        </header>
        <div className="development-bar">
          <p>for development only</p>
          <Link to="/lokalsbiz/dashboard">Dashboard</Link>
          <Link to="/explore" >New Explore</Link>
          <a href="/lokalsbiz/event" >Event</a>
          <a href="/lokalsbiz/story" >Story</a>
        </div>
      </div>
    )
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps, { facebookAuth, googleAuth, emailLogin ,logoutUser })(Navbar);