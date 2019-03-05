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
import { faFireAlt, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './Navbar.css'
import SearchBar from './SearchBar';

library.add(faFireAlt, faAngleDown);

const INITIAL_STATE = {
  email: '',
  password: '',
  loginBarActive: false,
  devBar: false
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      hasScroll: false,
      bgOpacity: 0,
    }
  }
  componentDidMount() {
    window.onscroll = this.handlePageScroll;
  }
  handlePageScroll = () => {
    var offsetTop = window.pageYOffset;
    // if (offsetTop > 60) {
    //   console.log(">60");
    //   this.setState({hasScroll: true});
    // } else {
    //   this.setState({hasScroll: false});
    // }
    if (offsetTop > 60) {
      this.setState({bgOpacity: 0.8})
    } else if (offsetTop <= 10) {
      this.setState({bgOpacity: 0})
    } else {
      this.setState({bgOpacity: (offsetTop-10)/50 - 0.2})
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
    const { bgOpacity } = this.state;
    // const errors = {};
    const guestLinks = (
      <div className="auth-link">
        {/* <li><button type="button" onClick={this.showLoginBar} className="login-btn">Log In</button></li> */}
        <Link to="/login" className="login-btn">Log in</Link>
        <Link to="/signup" className="signup-btn">Sign up</Link>
      </div>
    );
    const loggedLinks = (
      <div className="auth-link logged">
        <div className="welcome-user">
          <span>Welcome, </span>
          <Link to="/preference" className="preference-link"><strong>{ isAuth && user.name.first}</strong></Link>
        </div>
        <button type="button" onClick={this.onLogout} className="logout-btn">Log out</button>
      </div>
    );
    // const bgColor = {backgroundColor: `rgba(16, 101, 155, ${bgOpacity})`};
    // const bgGradient = {background: `linear-gradient(rgba(4, 155, 183,${bgOpacity}), rgba(15, 94, 167,0))`}
    const bgGradientMono = {background: `linear-gradient(rgba(0, 0, 0,${bgOpacity}), rgba(19, 22, 26,${bgOpacity*0.8}), rgba(19, 22, 26, 0)`};
    return (
      <div>
        <header className={this.state.hasScroll?"app-header offset":"app-header"} id="app-header"
          // style={bgGradientMono}
        >
          <div className="left">
            <Link to="/">
              <h1 className="app-name">L<span><FontAwesomeIcon icon="fire-alt" className="icon"/></span>KALS</h1>
            </Link>
              {/* <ul className="nav-link">
                <li><a href="/">Explore</a></li>
                <li><a href="/">Activities</a></li>
                <li><Link to="/lokalsforbusiness">For Business</Link></li>
              </ul> */}
              <SearchBar
              classname="top-search-bar"
            />
          </div>
          {isAuth? loggedLinks : guestLinks}
          {/* {guestLinks} */}
        </header>
        <div className={this.state.devBar?"development-bar opened":"development-bar"}>
          <FontAwesomeIcon icon="angle-down" className="open-devbar" onClick={(()=>this.setState({devBar: !this.state.devBar}))}/>
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