'use-strict';
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  ACCESS_TOKEN_LOGIN,
} from '../actions/login';

export const initialState = {
  isCreatingUser: false,
  isLoggingIn: false,
  error: false,
  accessToken: null,
  payload: null,
  email: 'ijakkra@gmail.com',
  isAtHome: false,
};


export default function reminders(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state,
        isLoggingIn: true,
        error: false,
        };
    case LOGIN_SUCCESS:
      return { ...state,
        isLoggingIn: false,
        error: false,
        payload: action.payload,
				accessToken: action.payload.token,
        };
    case LOGIN_FAILURE:
      return { ...state,
        isLoggingIn: false,
        error: true,
        };
    case CREATE_USER_REQUEST:
      return { ...state,
        isCreatingUser: true,
        error: false,
        };
    case CREATE_USER_SUCCESS:
      return { ...state,
        isCreatingUser: false,
        error: false,
        payload: action.payload,
				isAtHome: action.payload.isAtHome,
        };
    case CREATE_USER_FAILURE:
      return { ...state,
        isCreatingUser: false,
        error: true,
        };
    case ACCESS_TOKEN_LOGIN:
      return { ...state,
        isLoggingIn: false,
        error: false,
        };
    default:
      return state;
  }
}
