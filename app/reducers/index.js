import { combineReducers } from 'redux';
import navReducer from './navReducer';
import reminders from './reminders';
import user from './user';
import data from './data';
import light from './light';

const rootReducer = combineReducers({
  navReducer,
  reminders,
  user,
  data,
  light,
});

export default rootReducer;
