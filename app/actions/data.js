export const FETCH_TEMPERATURE_REQUEST = 'FETCH_TEMPERATURE_REQUEST';
export const FETCH_TEMPERATURE_SUCCESS = 'FETCH_TEMPERATURE_SUCCESS';
export const FETCH_TEMPERATURE_FAILURE = 'FETCH_TEMPERATURE_FAILURE';


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
  fetch(config.serverURL + '/api/temperature/?token=' + token)
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
