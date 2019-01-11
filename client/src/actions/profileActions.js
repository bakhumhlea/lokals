import TYPES from "./types";
import Axios from "axios";
// import isEmpty from '../util/is-empty';

export const setProfile = userid => dispatch => {
  Axios
    .get(`/api/profile`)
    .then(res => {
      dispatch({
        type: TYPES.SET_USER_PROFILE,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
}
export const clearProfile = () => {
  return {
    type: TYPES.CLEAR_USER_PROFILE,
    payload: {}
  }
}
export const saveToCollections = id => dispatch => {
  Axios
    .post(`/api/profile/collections`, { business_id: id })
    .then(res => dispatch(setProfile()))
    .catch(err => console.log(err));
}