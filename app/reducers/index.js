import { combineReducers } from 'redux';
import navReducer from './navReducer';
import reminders from './reminders';
import login from './login';

const rootReducer = combineReducers({
  navReducer,
  reminders,
  login,
});

export default rootReducer;
