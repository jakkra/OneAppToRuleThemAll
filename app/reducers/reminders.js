'use-strict';
import {
  FETCH_REMINDER_REQUEST,
  FETCH_REMINDER_SUCCESS,
  FETCH_REMINDER_FAILURE,
  CREATE_REMINDER_REQUEST,
  CREATE_REMINDER_SUCCESS,
  CREATE_REMINDER_FAILURE,
  EDIT_REMINDER_REQUEST,
  EDIT_REMINDER_SUCCESS,
  EDIT_REMINDER_FAILURE,
} from '../actions/reminders';

export const initialState = {
  events: [],
  error: false,
  isFetching: false,
  isCreatingEvent: false,
  editedEvent: null,
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

    case CREATE_REMINDER_REQUEST:
      return { ...state,
        isCreatingEvent: true,
        error: false,
        };
    case CREATE_REMINDER_SUCCESS:
      return { ...state,
        isCreatingEvent: false,
        error: false,
        };
    case CREATE_REMINDER_FAILURE:
      return { ...state,
        isCreatingEvent: false,
        error: true,
        };

    case EDIT_REMINDER_REQUEST:
      return { ...state,
        editedEvent: null,
        error: false,
        };
    case EDIT_REMINDER_SUCCESS: {
      const tempEvents = state.events;
      for (let i = 0; i < state.events.length; i++) {
        if (state.events[i].id === action.payload.reminder.id) {
          tempEvents[i].title = action.payload.reminder.title;
          tempEvents[i].time = action.payload.reminder.time;
          tempEvents[i].completed = action.payload.reminder.completed;
          tempEvents[i].reminderActive = action.payload.reminder.reminderActive;
          tempEvents[i].deleted = action.payload.reminder.deleted;
          break;
        }
      }
      return { ...state,
        editedEvent: action.payload.reminder,
        events: tempEvents,
        error: false,
        };
    }
    case EDIT_REMINDER_FAILURE:
      return { ...state,
        editedEvent: null,
        error: true,
        };
    default:
      return state;
  }
}
