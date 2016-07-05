export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const ACCESS_TOKEN_LOGIN = 'ACCESS_TOKEN_LOGIN';

export function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}
export function loginSuccess(json) {
  return {
    type: LOGIN_SUCCESS,
    payload: json,
  };
}

export function loginFailure(json) {
  return {
    type: LOGIN_FAILURE,
    payload: json,
  };
}

export function createUserRequest() {
  return {
    type: CREATE_USER_REQUEST,
  };
}
export function createUserSuccess(json) {
  return {
    type: CREATE_USER_SUCCESS,
    payload: json,
  };
}

export function createUserFailure(json) {
  return {
    type: CREATE_USER_FAILURE,
    payload: json,
  };
}

export function accessTokenLogin(json) {
  return {
    type: ACCESS_TOKEN_LOGIN,
    payload: json,
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

function authenticateToServer(dispatch, email, password) {
  fetch('https://radiant-wave-58367.herokuapp.com/api/user/authenticate/', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
		.then(response => checkStatus(response))
		.then(response => response.json())
		.then(json => {
  if (json.success) {
    dispatch(loginSuccess(json));
  } else {
    dispatch(loginFailure(json));
  }
})
.catch(error => {
  dispatch(loginFailure(error));
});
}

function createUserOnServer(dispatch, name, email, password) {
  fetch('https://radiant-wave-58367.herokuapp.com/api/user/create/', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
		.then(response => checkStatus(response))
		.then(response => response.json())
		.then(json => {
  if (json.success) {
    dispatch(createUserSuccess(json));
  } else {
    dispatch(createUserFailure(json));
  }
})
.catch(error => {
  dispatch(createUserFailure(error));
});
}

export function authenticate(email, password) {
  return (dispatch) => {
    dispatch(loginRequest());
    authenticateToServer(dispatch, email, password);
  };
}

export function createUser(name, email, password) {
  return (dispatch) => {
    dispatch(createUserRequest());
    createUserOnServer(dispatch, name, email, password);
  };
}
