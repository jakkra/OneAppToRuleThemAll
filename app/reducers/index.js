import { combineReducers } from 'redux';
import navReducer from './navReducer';
import reminders from './reminders';
import login from './login';
import data from './data';
import light from './light';

const rootReducer = combineReducers({
  navReducer,
  reminders,
  login,
  data,
  light,
});

export default rootReducer;
