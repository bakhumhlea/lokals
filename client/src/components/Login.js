import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
// import GoogleLogout from 'react-google-login';
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '../config/keys';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

import { fab } from '@fortawesome/free-brands-svg-icons';
import { connect } from 'react-redux';
import { googleAuth, facebookAuth, emailLogin } from '../actions/authActions';
import './Login.css';

library.add(fab, faEnvelope, faLock);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      imageUrl: null,
      errors: {},
      redirect: '/'
    };
    this.errorResponse = (err) => {
      console.log(err);
    }
  }
  componentDidMount() {
    const { auth } = this.props;
    const { state } = this.props.location;
    if (state) {
      console.log(typeof state.from);
      this.setState({redirect: state.from});
    }
    if (auth.isAuth) {
      if (state && state.business_route) {
        if (auth.isAdmin) {
          if (state.from) this.props.history.push(state.from);
        }
        this.props.history.push('/'); // show warning popup instead
      } else if (state && state.from) {
        this.props.history.push(state.from);
      } else {
        this.props.history.push('/');
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { history } = this.props;
    const { state } = this.props.location;
    if (nextProps.auth.isAuth) {
      if (state && state.business_route) {
        if (nextProps.auth.isAdmin) {
          history.push(state.from);
          return true;
        }
        history.push('/'); // show warning popup instead TODO redirect to business page
        return false;
      } else if (state && state.from) {
        history.push(state.from);
        return true;
      } else {
        history.push('/');
        return true;
      }
    } else if (nextState !== this.state) {
      return true
    } else {
      return false;
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { redirect } = this.state;
    const cred = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.emailLogin(cred, this.props.history, redirect);
  }
  googleResponse = (res) => {
    const { redirect } = this.state;
    console.log(typeof redirect);
    this.props.googleAuth(res.tokenId, this.props.history, redirect);
  }
  facebookResponse = (res) => {
    const { history } = this.props;
    const { redirect } = this.state;
    if (res.name) {
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
      this.props.facebookAuth(userData, history, redirect);
    } else {
      console.log(res);
    }
  }
  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    // const expDate = (dateinms) => new Date(dateinms);
    const { email, password } = this.state;
    const { error } = this.props;
    return (
      <div className="page-container login-page">
        <div className="lk-card p-4 wd-5 mt-3 ml-auto mr-auto">
          <h4 className="hd-4 mt-2 mb-4"><strong>Log in</strong> to continue</h4>
          <div>
            <form onSubmit={this.onSubmit}>
              <div className="lk-ip-group">
                <label className="label-1 mb-2">
                <FontAwesomeIcon className="mr-2" icon="envelope"/>Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="lk-ip lg sha-1"
                  value={email}
                  onChange={(e) => this.onChange(e)}
                  placeholder="Email"
                />
                {error.types.email && (<p className="lk-err-text"><small>{error.types.email}</small></p>)}
              </div>
              <div className="lk-ip-group">
                <label className="label-1 mb-2">
                <FontAwesomeIcon className="mr-2" icon="lock"/>Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="lk-ip lg sha-1"
                  value={password}
                  onChange={(e) => this.onChange(e)}
                  placeholder="Password"
                />
                {error.types.password && (<p className="lk-err-text"><small>{error.types.password}</small></p>)}
                <div className="forgot-password">
                  <Link className="lk-link solo" to="/reset-password">Forgot your password?</Link>
                </div>
              </div>
              <div className="lk-ip-group">
                <input
                  type="submit"
                  className="lk-btn btn-dan spacial sha-1 wd-10"
                  name="login"
                  value="Login"
                />
              </div>
            </form>
          </div>
          <p className="label-1 or-text">or</p>
          <div className="flx-contn jt-spbt wd-10">
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              onSuccess={this.googleResponse}
              onFailure={this.errorResponse}
              uxMode={'popup'}
              render={renderProps => (
                <button className="lk-btn-ol mr-1 wd-10 sha-1" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','google']}/>Log in with Google</button>
              )}
            />
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              // scope="public_profile"
              callback={this.facebookResponse}
              render={renderProps => (
                <button className="lk-btn-ol ml-1 wd-10 sha-1" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','facebook-f']}/>Log in with Facebook</button>
              )}
            />
          </div>
          <div className="wd-10 mt-4 new-to-text">New to <strong>Lokals</strong>?<span className="lk-link solo ml-2">Create Account</span></div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  googleAuth: PropTypes.func.isRequired,
  facebookAuth: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, { googleAuth, facebookAuth, emailLogin })(Login);
// export default Login;
