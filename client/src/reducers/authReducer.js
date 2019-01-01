import TYPES from "../actions/types";

const INITIAL_STATE = {
  isAuth: false,
  user: {},
  errors: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.EMAIL_SIGN_IN:
      return {
        ...state,
        user: action.payload
      };
    case TYPES.GOOGLE_SIGN_IN:
      return {
        ...state,
        user: action.payload
      };
    case TYPES.SET_CURRENT_USER:
      return {
        ...state,
        isAuth: true,
        user: action.payload
      };
    case TYPES.GET_ERRORS:
      return {
        ...state,
        errors: action.payload
      }
    default:
      return state;
  }
};