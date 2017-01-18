import {
	LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from '../actions/user';

import SessionHandler from './SessionHandler';

const sessionHandler = new SessionHandler();

export default store => next => action => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      sessionHandler.storeSessionUser(action.payload);
      break;
    case LOGOUT_SUCCESS:
      sessionHandler.deleteSessionUser();
      break;
    case LOGOUT_FAILURE:
      sessionHandler.deleteSessionUser();
      break;
    default:
      break;
  }
  return next(action);
};
