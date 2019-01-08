import { combineReducers } from 'redux';
import authReducer from './authReducer';
import searchReducer from './searchReducer';
import businessReducer from './businessReducer';

export default combineReducers({
  auth: authReducer,
  search: searchReducer,
  business: businessReducer,
});
