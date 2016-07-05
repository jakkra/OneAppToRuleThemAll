'use-strict';
import {
  FETCH_REMINDER_REQUEST,
  FETCH_REMINDER_SUCCESS,
  FETCH_REMINDER_FAILURE,
} from '../actions/reminders';

export const initialState = {
  events: [],
  error: false,
  isFetching: false,
};

export default function reminders(state = initialState, action) {
  switch (action.type) {
    case FETCH_REMINDER_REQUEST:
      return { ...state,
        isFetching: true,
        error: false,
        };
    case FETCH_REMINDER_SUCCESS:
      return { ...state,
        isFetching: false,
        error: false,
        events: action.payload,
        };
    case FETCH_REMINDER_FAILURE:
      return { ...state,
        isFetching: false,
        error: true,
        };
    default:
      return state;
  }
}
