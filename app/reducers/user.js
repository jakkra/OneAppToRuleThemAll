'use-strict';
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  ACCESS_TOKEN_LOGIN,
	UPDATE_USER_REQUEST,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILURE,
} from '../actions/user';

export const initialState = {
  isCreatingUser: false,
  isLoggingIn: false,
  isUpdatingUser: false,
  error: false,
  accessToken: null,
  payload: null,
  email: '',
  user: null,
  isAtHome: false,
};


export default function user(state = initialState, action) {
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
				user: action.payload.user,
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
    case UPDATE_USER_REQUEST:
      return { ...state,
        isUpdatingUser: true,
        error: false,
        };
    case UPDATE_USER_SUCCESS:
      return { ...state,
        isUpdatingUser: false,
        error: false,
				user: action.payload.user,
        };
    case UPDATE_USER_FAILURE:
      return { ...state,
        isUpdatingUser: false,
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
