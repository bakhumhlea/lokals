import React, { Component } from 'react'
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { GOOGLE_CLIENT_ID } from '../config/keys';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { connect } from 'react-redux';
import { googleSignIn, test } from '../actions/authActions';

library.add(fab);

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      imageUrl: null,
    };
    this.errorResponse = (err) => {
      console.log(err);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.auth.isAuth) {
      this.props.history.push('/');
    }
  }
  onGoogleSignupSuccess = (res) => {
    this.props.googleSignIn(res.tokenId);
  }
  onLogout(res) {
    console.log(res);
  }
  render() {
    // const expDate = (dateinms) => new Date(dateinms);
    return (
      <div>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={this.onGoogleSignupSuccess}
          onFailure={this.errorResponse}
          uxMode={'popup'}
          render={renderProps => (
            <button className="btn-d mr-3" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-1" icon={['fab','google']}/> Sign In with Google</button>
          )}
        />
        <GoogleLogout
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={this.logout}
          render={renderProps => (
            <button className="btn-d mr-3" onClick={renderProps.onClick}><FontAwesomeIcon className="mr-1" icon={['fab','facebook-f']}/> Sign In with Facebook</button>
          )}
        />
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

Register.propTypes = {
  googleSignIn: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { googleSignIn })(Register);
// export default Register;
