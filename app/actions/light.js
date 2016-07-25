export const FETCH_LIGHTS_INFO_REQUEST = 'FETCH_LIGHTS_INFO_REQUEST';
export const FETCH_LIGHTS_INFO_SUCCESS = 'FETCH_LIGHTS_INFO_SUCCESS';
export const FETCH_LIGHTS_INFO_FAILURE = 'FETCH_LIGHTS_INFO_FAILURE';

export const SEND_LIGHT_CHANGE_REQUEST = 'SEND_LIGHT_CHANGE_REQUEST';
export const SEND_LIGHT_CHANGE_SUCCESS = 'SEND_LIGHT_CHANGE_SUCCESS';
export const SEND_LIGHT_CHANGE_FAILURE = 'SEND_LIGHT_CHANGE_FAILURE';


import config from '../util/config';

export function fetchLightsInfoRequest() {
  return {
    type: FETCH_LIGHTS_INFO_REQUEST,
  };
}

export function fetchLightsInfoSuccess(info) {
  return {
    type: FETCH_LIGHTS_INFO_SUCCESS,
    payload: info,
  };
}

export function fetchLightsInfoFailure() {
  return {
    type: FETCH_LIGHTS_INFO_FAILURE,
  };
}

export function sendLightChangeRequest() {
  return {
    type: SEND_LIGHT_CHANGE_REQUEST,
  };
}

export function sendLightChangeSuccess(json) {
  return {
    type: SEND_LIGHT_CHANGE_SUCCESS,
    payload: json,
  };
}

export function sendLightChangeFailure() {
  return {
    type: SEND_LIGHT_CHANGE_FAILURE,
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

function startFetchInfo(dispatch, token) {
  fetch(config.serverURL + '/api/light/?token=' + token)
  .then(response => checkStatus(response))
  .then(response => response.json())
  .then(json => {
    if (json.success === true) {
      dispatch(fetchLightsInfoSuccess(json));
    } else {
      dispatch(fetchLightsInfoFailure());
    }
  })
  .catch(error => dispatch(fetchLightsInfoFailure(error)));
}

export function fetchHueLighsInfo(token) {
  return (dispatch) => {
    dispatch(fetchLightsInfoRequest());
    startFetchInfo(dispatch, token);
  };
}
function sendLightChange(dispatch, token, params) {
  fetch(config.serverURL + '/api/light', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(params),
  })
  .then(response => checkStatus(response))
  .then(response => response.json())
  .then(json => {
    if (json.success === true) {
      dispatch(sendLightChangeSuccess(json));
    } else {
      dispatch(sendLightChangeFailure());
    }
  })
  .catch(error => dispatch(sendLightChangeFailure(error)));
}

export function changeLightState(token, lightId, params) {
  const p = params;
  p.url = '/api/0/lights/' + lightId + '/state';
  return (dispatch) => {
    dispatch(sendLightChangeRequest());
    sendLightChange(dispatch, token, params);
  };
}

export function changeGroupState(token, groupId, params) {
  const p = params;
  p.url = '/api/0/groups/' + groupId + '/action';
  return (dispatch) => {
    dispatch(sendLightChangeRequest());
    sendLightChange(dispatch, token, params);
  };
}
