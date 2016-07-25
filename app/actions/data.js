export const FETCH_TEMPERATURE_REQUEST = 'FETCH_TEMPERATURE_REQUEST';
export const FETCH_TEMPERATURE_SUCCESS = 'FETCH_TEMPERATURE_SUCCESS';
export const FETCH_TEMPERATURE_FAILURE = 'FETCH_TEMPERATURE_FAILURE';

export const FETCH_LIMIT_TEMPERATURE_REQUEST = 'FETCH_LIMIT_TEMPERATURE_REQUEST';
export const FETCH_LIMIT_TEMPERATURE_SUCCESS = 'FETCH_LIMIT_TEMPERATURE_SUCCESS';
export const FETCH_LIMIT_TEMPERATURE_FAILURE = 'FETCH_LIMIT_TEMPERATURE_FAILURE';

export const FETCH_LOGS_REQUEST = 'FETCH_LOGS_REQUEST';
export const FETCH_LOGS_SUCCESS = 'FETCH_LOGS_SUCCESS';
export const FETCH_LOGS_FAILURE = 'FETCH_LOGS_FAILURE';

import config from '../util/config';

export function fetchTemperatureRequest() {
  return {
    type: FETCH_TEMPERATURE_REQUEST,
  };
}

export function fetchTemperatureSuccess(temperatures) {
  return {
    type: FETCH_TEMPERATURE_SUCCESS,
    payload: temperatures,
  };
}

export function fetchTemperatureFailure() {
  return {
    type: FETCH_TEMPERATURE_FAILURE,
  };
}

export function fetchLimitTemperatureRequest() {
  return {
    type: FETCH_LIMIT_TEMPERATURE_REQUEST,
  };
}

export function fetchLimitTemperatureSuccess(temperatures) {
  return {
    type: FETCH_LIMIT_TEMPERATURE_SUCCESS,
    payload: temperatures,
  };
}

export function fetchLimitTemperatureFailure() {
  return {
    type: FETCH_LIMIT_TEMPERATURE_FAILURE,
  };
}

export function fetchLogsRequest() {
  return {
    type: FETCH_LOGS_REQUEST,
  };
}

export function fetchLogsSuccess(logs) {
  return {
    type: FETCH_LOGS_SUCCESS,
    payload: logs,
  };
}

export function fetchLogsFailure() {
  return {
    type: FETCH_LOGS_FAILURE,
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
  const error = new Error();
  error.response = response;
  throw error;
}

function startFetchTemperatures(dispatch, token) {
  fetch(config.serverURL + '/api/temperature/?unit=days&count=7&token=' + token)
  .then(response => checkStatus(response))
  .then(response => response.json())
  .then(json => {
    if (json.success === true) {
      dispatch(fetchTemperatureSuccess(json));
    } else {
      dispatch(fetchTemperatureFailure(json));
    }
  })
  .catch(error => dispatch(fetchTemperatureFailure(error)));
}

/**
 * Fetches all Reminders
 * @param {Number} auth to authenticate to the server
 */
export function fetchTemperatures(token) {
  return (dispatch) => {
    dispatch(fetchTemperatureRequest());
    startFetchTemperatures(dispatch, token);
  };
}
function startFetchLimitedTemperatures(dispatch, token, endDate, unit, count, limit) {
  let url = config.serverURL + '/api/temperature/?token=' + token;
  if (endDate) url = url + '&endDate=' + endDate;
  if (unit) url = url + '&unit=' + unit;
  if (count) url = url + '&count=' + count;
  if (limit) url = url + '&limit=' + limit;

  fetch(url)
  .then(response => checkStatus(response))
  .then(response => response.json())
  .then(json => {
    if (json.success === true) {
      dispatch(fetchLimitTemperatureSuccess(json));
    } else {
      dispatch(fetchLimitTemperatureFailure(json));
    }
  })
  .catch(error => dispatch(fetchLimitTemperatureFailure(error)));
}

/**
 * Fetches all Reminders
 * @param {Number} auth to authenticate to the server
 */
export function fetchTemperaturesLimit(token, endDate, unit, count, limit) {
  return (dispatch) => {
    dispatch(fetchLimitTemperatureRequest());
    startFetchLimitedTemperatures(dispatch, token, endDate, unit, count, limit);
  };
}

function startFetchLogs(dispatch, token) {
  fetch(config.serverURL + '/api/surveillance/?wasAtHome=false&token=' + token)
  .then(response => checkStatus(response))
  .then(response => response.json())
  .then(json => {
    if (json.success === true) {
      dispatch(fetchLogsSuccess(json));
    } else {
      dispatch(fetchLogsFailure(json));
    }
  })
  .catch(error => dispatch(fetchLogsFailure(error)));
}

/**
 * Fetches all Reminders
 * @param {Number} auth to authenticate to the server
 */
export function fetchLogs(token) {
  return (dispatch) => {
    dispatch(fetchLogsRequest());
    startFetchLogs(dispatch, token);
  };
}
