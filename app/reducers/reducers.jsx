import {combineReducers} from 'redux';
import trackingReducer from './trackingReducer';
import scormReducer from './scormReducer';
import userProfileReducer from './userProfileReducer';

const GlobalState = combineReducers({
  tracking:trackingReducer,
  scorm:scormReducer,
  user_profile:userProfileReducer,
});

export default GlobalState;