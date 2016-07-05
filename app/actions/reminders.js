export const FETCH_REMINDER_REQUEST = 'FETCH_REMINDER_REQUEST';
export const FETCH_REMINDER_SUCCESS = 'FETCH_REMINDER_SUCCESS';
export const FETCH_REMINDER_FAILURE = 'FETCH_REMINDER_FAILURE';

export function fetchReminderRequest() {
  return {
    type: FETCH_REMINDER_REQUEST,
  };
}

export function fetchReminderSuccess(events) {
  return {
    type: FETCH_REMINDER_SUCCESS,
    payload: events,
  };
}

export function fetchReminderFailure() {
  return {
    type: FETCH_REMINDER_FAILURE,
  };
}

/**
 * Checks if a response was successful, throws an error if it's not.
 * @param {Object} response, the json reseived from the server
 */
function checkStatus(response) {
  if (response.status === 200) {
    return response;
  }
  console.log('THROWING ERROR');
  const error = new Error();
  error.response = response;
  throw error;
}

function startfetchingReminders(dispatch, auth) {
  fetch('https://radiant-wave-58367.herokuapp.com/api/reminder/list?token=eyJhbGciOiJIUzI1NiJ9.aWpha2tyYUBnbWFpbC5jb20.kukrD_C1oJizmCvBc5-UOoUJBevMKC1o0BXRChidL5E')
  .then(response => response.json())
  .then(events => dispatch(fetchReminderSuccess(events)))
  .catch(error => dispatch(fetchReminderFailure(error)));
}

/**
 * Fetches all albums, photos and comments from the server. Dispatches an fetchPhotoRequest.
 * @param {Number} accessToken to authenticate to the server
 */
export function fetchReminders(auth) {
  return (dispatch) => {
    dispatch(fetchReminderRequest());
    startfetchingReminders(dispatch, auth);
  };
}
