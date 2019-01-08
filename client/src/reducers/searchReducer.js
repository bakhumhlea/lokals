import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  businessResults: [],
  eventResults: [],
  mapCenter: {},
  zoom: 12
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_RESULTS:
      return {
        ...state,
        businessResults: action.payload,
      };
    case TYPES.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload
      }
    case TYPES.SET_CENTER:
      return {
        ...state,
        mapCenter: action.payload
      };
    default:
      return state;
  }
};