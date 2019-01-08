import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
// import GoogleLogout from 'react-google-login';
import TextFieldGroup from './reusable/TextFieldGroup';
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
      user: null,
      imageUrl: null,
      errors: {}
    };
    this.errorResponse = (err) => {
      console.log(err);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.auth.isAuth) {
      this.props.history.push('/');
      return true
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
    this.setState({email: '', password: ''});
  }
  googleResponse = (res) => {
    this.props.googleAuth(res.tokenId);
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
  }
  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    // const expDate = (dateinms) => new Date(dateinms);
    const { errors } = this.state;
    return (
      <div className="login-page">
        <div className="w-40 m-auto">
          <h5 className="login-header"><strong>Log in</strong> to continue</h5>
          <div className="form-group social-btn gg-btn">
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              onSuccess={this.googleResponse}
              onFailure={this.errorResponse}
              uxMode={'popup'}
              render={renderProps => (
                <button className="form-control w-100 btn-d mr-3" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','google']}/>Log in with Google</button>
              )}
            />
          </div>
          <div className="form-group social-btn fb-btn">
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              // scope="public_profile"
              callback={this.facebookResponse}
              render={renderProps => (
                <button className="form-control w-100 btn-d mr-4" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','facebook-f']}/>Log in with Facebook</button>
              )}
            />
          </div>
          <p className="or-text">or</p>
          <hr/>
          <div className="form-group mt-4">
            <form onSubmit={this.onSubmit}>
              <FontAwesomeIcon className="input-icon m-auto" icon="envelope"/>
              <TextFieldGroup
                type="email"
                divclass="mb-0"
                classname="form-control form-control-md login-input"
                placeholder="Email" 
                name="email"
                error={errors.email}
                onChange={(e) => this.onChange(e)}
              />
              <FontAwesomeIcon className="input-icon m-auto" icon="lock"/>
              <TextFieldGroup
                type="password"
                divclass="mb-1"
                classname="form-control form-control-md login-input"
                placeholder="Password" 
                name="password"
                error={errors.password}
                onChange={(e) => this.onChange(e)}
              />
              <Link className="forgot-password-link" to="/reset-password">Forgot your password?</Link>
              <input
                type="submit"
                className="form-control form-control-md btn-d login-submit-btn"
                name="login"
                value="Login"
              />
            </form>
          </div>
        </div>
        {this.state.user && (
          <div>
            <img src={this.state.user.imageUrl} alt={this.state.user.name} width="60px" height="60px" style={{borderRight: '100px'}}/>
            <p>{this.state.user.first + this.state.user.last}</p>
            <p>{this.state.user.email}</p>
          </div>
        )}
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
  auth: state.auth
});

export default connect(mapStateToProps, { googleAuth, facebookAuth, emailLogin })(Login);
// export default Login;
