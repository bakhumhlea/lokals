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
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'

import { fab } from '@fortawesome/free-brands-svg-icons';
import { connect } from 'react-redux';
import { googleAuth, facebookAuth, emailSignUp } from '../actions/authActions';
import './Register.css';

library.add(fab, faEnvelope, faLock, faUser);

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      password: '',
      password2: '',
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
    return false
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { first, last, email, password, password2 } = this.state;
    const userData = {
      first: first,
      last: last,
      email: email,
      password: password,
      password2: password2
    };
    this.props.emailSignUp(userData);
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
  render() {
    // const expDate = (dateinms) => new Date(dateinms);
    const { errors } = this.state;
    return (
      <div className="register-page">
        <div className="motto w-60 pr-4">
          <h2 className="register-motto">Explore your local and<br/>have a great experience<br/>near you</h2>
          <h5 className="header-sub-1">Places, Events and Activities</h5>
          {/* <h5 className="header-sub-1">Mucho trabajo, poco dinero... puta madre!</h5> */}
        </div>
        <div className="w-40">
          <h5 className="login-header"><strong>Sign up</strong> with me free breakfast</h5>
          <div className="form-group social-btn gg-btn">
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              onSuccess={this.googleResponse}
              onFailure={this.errorResponse}
              uxMode={'popup'}
              theme={'dark'}
              render={renderProps => (
                <button className="form-control w-100 btn-d mr-3" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','google']}/>Sign up with Google</button>
              )}
            />
          </div>
          <div className="form-group social-btn fb-btn">
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields={'name,email,picture'}
              // scope="public_profile"
              authType={'reauthenticate'}
              callback={this.facebookResponse}
              render={renderProps => (
                <button className="form-control w-100 btn-d mr-4" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-2" icon={['fab','facebook-f']}/>Sign up with Facebook</button>
              )}
            />
          </div>
          <p className="or-text">or</p>
          <hr/>
          <h6 className="email-signup-header mt-4">Sign up with your <strong>email</strong></h6>
          <div className="form-group">
            <form onSubmit={this.onSubmit}>
              <FontAwesomeIcon className="input-icon m-auto" icon="user"/>
              <div className="form-group-inline gap-btwn">
                <TextFieldGroup
                  type="text"
                  divclass="mb-0"
                  classname="form-control form-control-md login-input name-input first"
                  placeholder="Firstname" 
                  name="first"
                  error={errors.name}
                  onChange={(e) => this.onChange(e)}
                />
                <TextFieldGroup
                  type="text"
                  divclass="mb-0"
                  classname="form-control form-control-md login-input name-input"
                  placeholder="Lastname" 
                  name="last"
                  error={errors.name}
                  onChange={(e) => this.onChange(e)}
                />
              </div>
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
              <FontAwesomeIcon className="input-icon m-auto" icon="lock"/>
              <TextFieldGroup
                type="password"
                divclass="mb-1"
                classname="form-control form-control-md login-input"
                placeholder="Confirm Password" 
                name="password2"
                error={errors.password2}
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
      </div>
    )
  }
}

Register.propTypes = {
  googleAuth: PropTypes.func.isRequired,
  facebookAuth: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { googleAuth, facebookAuth, emailSignUp })(Register);
// export default Register;
