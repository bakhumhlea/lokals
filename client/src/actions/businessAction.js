import TYPES from "./types";
// import Axios from "axios";
// import isEmpty from '../util/is-empty';

export const goToEditBusinessProfile = (businessdata, history) => {
  history.push('/claimyourbusiness/edit-profile');
  return {
    type: TYPES.GET_BUSINESS_PROFILE,
    payload: businessdata
  }
};