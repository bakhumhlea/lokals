import TYPES from "./types";
import Axios from "axios";
import setAuthToken from '../util/setAuthToken';
import jwt_decode from 'jwt-decode'

export const test = (data) => {
  return {
    type: "TEST",
    payloaf: data
  }
}
export const emailSignIn = (credential) => dispatch => {
  Axios.post(`api/users/signin`, credential)
    .then(res => {
      const { token } = res.data;
      dispatch(setCurrentUser(token));
      return {
        type: TYPES.EMAIL_SIGN_IN,
        payload: res.data
      }
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    })
}
export const googleSignIn = (tokenId) => dispatch => {
  Axios.post(`api/users/signup/google/${tokenId}`)
    .then(res => {
      const { token } = res.data;
      return dispatch(setCurrentUser(token));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    });
};

export const setCurrentUser = (token) => {
  if (token) {
    const decoded = jwt_decode(token);
    setAuthToken(token);
    localStorage.setItem('lokals_token', token);
    return {
      type: TYPES.SET_CURRENT_USER,
      payload: decoded
    };
  } else {
    setAuthToken(null);
    localStorage.removeItem('lokals_token');
    return {
      type: TYPES.LOG_OUT,
      payload: {}
    }
  }
}