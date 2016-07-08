export const FETCH_REMINDER_REQUEST = 'FETCH_REMINDER_REQUEST';
export const FETCH_REMINDER_SUCCESS = 'FETCH_REMINDER_SUCCESS';
export const FETCH_REMINDER_FAILURE = 'FETCH_REMINDER_FAILURE';

export const CREATE_REMINDER_REQUEST = 'CREATE_REMINDER_REQUEST';
export const CREATE_REMINDER_SUCCESS = 'CREATE_REMINDER_SUCCESS';
export const CREATE_REMINDER_FAILURE = 'CREATE_REMINDER_FAILURE';

export const EDIT_REMINDER_REQUEST = 'EDIT_REMINDER_REQUEST';
export const EDIT_REMINDER_SUCCESS = 'EDIT_REMINDER_SUCCESS';
export const EDIT_REMINDER_FAILURE = 'EDIT_REMINDER_FAILURE';

import config from '../util/config';

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

export function createReminderRequest() {
  return {
    type: CREATE_REMINDER_REQUEST,
  };
}

export function createReminderSuccess(json) {
  return {
    type: CREATE_REMINDER_SUCCESS,
    payload: json,
  };
}

export function createReminderFailure() {
  return {
    type: CREATE_REMINDER_FAILURE,
  };
}

export function editReminderRequest() {
  return {
    type: EDIT_REMINDER_REQUEST,
  };
}

export function editReminderSuccess(json) {
  return {
    type: EDIT_REMINDER_SUCCESS,
    payload: json,
  };
}

export function editReminderFailure() {
  return {
    type: EDIT_REMINDER_FAILURE,
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

function startfetchingReminders(dispatch, token) {
  fetch(config.serverURL + '/api/reminder/list?token=' + token)
  .then(response => response.json())
  .then(events => dispatch(fetchReminderSuccess(events)))
  .catch(error => dispatch(fetchReminderFailure(error)));
}

/**
 * Fetches all Reminders
 * @param {Number} auth to authenticate to the server
 */
export function fetchReminders(token) {
  return (dispatch) => {
    dispatch(fetchReminderRequest());
    startfetchingReminders(dispatch, token);
  };
}

function createNewReminder(dispatch, event, token) {
  fetch(config.serverURL + '/api/reminder/create/', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(event),
  })
		.then(response => checkStatus(response))
		.then(response => response.json())
		.then(json => {
  if (json.success) {
    dispatch(createReminderSuccess(json));
  } else {
    dispatch(createReminderFailure(json));
  }
})
.catch(error => {
  dispatch(createReminderFailure(error));
});
}

/**
 * Creates a new reminder
 * @param {Number} auth to authenticate to the server
 */
export function createReminder(event, token) {
  return (dispatch) => {
    dispatch(createReminderRequest());
    createNewReminder(dispatch, event, token);
  };
}


function sendEditReminder(dispatch, event, token, successCallback, failureCallback) {
  fetch(config.serverURL + '/api/reminder/edit', {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(event),
  })
		.then(response => checkStatus(response))
		.then(response => response.json())
		.then(json => {
  if (json.success) {
    dispatch(successCallback(json));
  } else {
    dispatch(failureCallback(json));
  }
})
.catch(error => {
  dispatch(failureCallback(error));
});
}

/**
 * Edits a reminder with id with spcified params
 * @param {Number} auth to authenticate to the server
 */
export function editReminder(event, token) {
  return (dispatch) => {
    dispatch(editReminderRequest());
    sendEditReminder(dispatch, event, token, editReminderSuccess, editReminderFailure);
  };
}
