'use-strict';
import {
  FETCH_LIGHTS_INFO_REQUEST,
  FETCH_LIGHTS_INFO_SUCCESS,
  FETCH_LIGHTS_INFO_FAILURE,
  SEND_LIGHT_CHANGE_REQUEST,
  SEND_LIGHT_CHANGE_SUCCESS,
  SEND_LIGHT_CHANGE_FAILURE,
} from '../actions/light';

export const initialState = {
  info: null,
  error: false,
  isFetching: false,
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case FETCH_LIGHTS_INFO_REQUEST:
      return { ...state,
        isFetching: true,
        error: false,
        };
    case FETCH_LIGHTS_INFO_SUCCESS:
      return { ...state,
        info: action.payload,
        isFetching: false,
        error: false,
        };
    case FETCH_LIGHTS_INFO_FAILURE:
      return { ...state,
        isFetching: false,
        error: true,
        };
    case SEND_LIGHT_CHANGE_REQUEST:
      return { ...state,
        isFetching: true,
        error: false,
        };
    case SEND_LIGHT_CHANGE_SUCCESS:
      return { ...state,
        isFetching: false,
        error: false,
        };
    case SEND_LIGHT_CHANGE_FAILURE:
      return { ...state,
        isFetching: false,
        error: true,
        };
    default:
      return state;
  }
}
