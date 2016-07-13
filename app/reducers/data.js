'use-strict';
import {
  FETCH_TEMPERATURE_REQUEST,
  FETCH_TEMPERATURE_SUCCESS,
  FETCH_TEMPERATURE_FAILURE,
} from '../actions/data';

export const initialState = {
  temperatures: [],
  error: false,
  isFetching: false,
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
    default:
      return state;
  }
}
