import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  profile: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_USER_PROFILE:
      return {
        profile: action.payload
      };
    case TYPES.CLEAR_USER_PROFILE:
      return {
        profile: action.payload
      };
    default:
      return state;
  }
};