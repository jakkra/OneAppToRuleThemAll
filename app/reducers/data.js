'use-strict';
import {
  FETCH_TEMPERATURE_REQUEST,
  FETCH_TEMPERATURE_SUCCESS,
  FETCH_TEMPERATURE_FAILURE,
  FETCH_LIMIT_TEMPERATURE_REQUEST,
  FETCH_LIMIT_TEMPERATURE_SUCCESS,
  FETCH_LIMIT_TEMPERATURE_FAILURE,
} from '../actions/data';

export const initialState = {
  temperatures: [],
  error: false,
  isFetching: false,
  isFetchingLimited: false,
  limitedTemperatures: [],
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEMPERATURE_REQUEST:
      return { ...state,
        isFetching: true,
        error: false,
        };
    case FETCH_TEMPERATURE_SUCCESS:
      return { ...state,
        temperatures: action.payload.temperatures,
        isFetching: false,
        error: false,
        };
    case FETCH_TEMPERATURE_FAILURE:
      return { ...state,
        isFetching: false,
        error: true,
        };
    case FETCH_LIMIT_TEMPERATURE_REQUEST:
      return { ...state,
        limitedTemperatures: [],
        isFetchingLimited: true,
        error: false,
        };
    case FETCH_LIMIT_TEMPERATURE_SUCCESS:
      return { ...state,
        limitedTemperatures: action.payload.temperatures,
        isFetchingLimited: false,
        error: false,
        };
    case FETCH_LIMIT_TEMPERATURE_FAILURE:
      return { ...state,
        isFetchingLimited: false,
        error: true,
        };
    default:
      return state;
  }
}
