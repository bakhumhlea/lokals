import TYPES from "./types";
import Axios from "axios";
import setAuthToken from '../util/setAuthToken';
import jwt_decode from 'jwt-decode';
import isEmpty from '../util/is-empty';
import { clearProfile } from "./profileActions";

export const emailSignUp = (userdata) => dispatch => {
  Axios.post(`api/users/signup`, userdata)
    .then(res => {
      const { email } = res.data.user;
      const cred = {
        email: email,
        password: userdata.password
      };
      return dispatch(emailLogin(cred));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    })
}
export const emailLogin = (credential) => dispatch => {
  Axios.post(`api/users/signin`, credential)
    .then(res => {
      const { token } = res.data;
      console.log(token);
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    })
}
export const googleAuth = (tokenId) => dispatch => {
  Axios.post(`api/users/auth/google/${tokenId}`)
    .then(res => {
      
      const { token } = res.data;
      console.log(token);
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    });
};

export const facebookAuth = (userdata) => dispatch => {
  Axios.post(`api/users/auth/facebook/`, userdata)
    .then(res => {
      const { token } = res.data;
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    });
};

export const setCurrentUser = (userdata) => {
  if (!isEmpty(userdata)) {
    return {
      type: TYPES.SET_CURRENT_USER,
      payload: { 
        user: userdata
      }
    };
  } else {
    return {
      type: TYPES.SET_CURRENT_USER,
      payload: {}
    };
  }
}
export const logoutUser = () => dispatch => {
  setToken();
  dispatch(clearProfile())
  dispatch({
    type: TYPES.LOG_OUT,
    payload: {}
  });
}
const setToken = (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
  } else {
    localStorage.removeItem('jwtToken');
    setAuthToken();
  }
}