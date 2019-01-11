import { combineReducers } from 'redux';
import authReducer from './authReducer';
import searchReducer from './searchReducer';
import businessReducer from './businessReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  auth: authReducer,
  user: profileReducer,
  search: searchReducer,
  business: businessReducer,
});
