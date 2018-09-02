import axios from 'axios';
import History from '../history.js';
import * as type from './types';

const API_URL = 'http://localhost:3003/api';
let TOKEN = localStorage.getItem('token');
let UID = localStorage.getItem('uid');

export const signUp = (...data) => {
  return async () => {
    await axios.post(`${API_URL}/users`, ...data)
      .then(() => {
        History.push('/signin');
      })
      .catch(error => {
        throw error.response.data.error.message;
      });
  };
};

export const setSession = (response) => {
  response.isAdmin = response.roles.find(x => x.name === 'admin') ? true : false;
  response.isEditor = response.roles.find(x => x.name === 'editor') ? true : false;
  sessionStorage.setItem('me', JSON.stringify(response))
  return response;
};

export const signIn = (...data) => {
  return async (dispatch) => {
    await axios.post(`${API_URL}/users/login`, ...data)
      .then(response => {
        localStorage.setItem('token', response.data.id);
        localStorage.setItem('uid', response.data.userId);
        localStorage.setItem('ttl', response.data.ttl);
        TOKEN = localStorage.getItem('token');
        UID = localStorage.getItem('uid');
        getUser(response.data.userId)
          .then(response => {
            dispatch({type: type.AUTH_USER, payload: setSession(response)});
            History.push('/home');
          })
          .catch(error => {
            throw error.response.data.error.message;
          })
      })
      .catch(error => {
        throw error.response.data.error.message;
      });
  };
};

export const getUser = (uid) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/users/${uid}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response.data.error)
      });
  });
};

export const getProfile = (username) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/users/profile/${username}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        resolve(response.data.user)
      })
      .catch(error => {
        reject(error.response.data.error)
      });
  });
};

export const getSession = (callback) => {
  const token = localStorage.getItem('token');
  const me = sessionStorage.getItem('me');
  if (token) {
    if (me) {
      callback(JSON.parse(me));
    } else {
      getUser(localStorage.getItem('uid'))
        .then((response) => {
          callback(setSession(response))
        })
        .catch((error) => {
          throw error.response.data.error.message;
        });
    }
  } else callback(null)
};

export const settingsAccount = (...data) => {
  return async (dispatch) => {
    await axios.patch(`${API_URL}/users/${UID}`, ...data,
      {headers: {authorization: TOKEN}})
      .then(response => {
        dispatch({type: type.AUTH_USER, payload: response.data});
      })
      .catch(error => {
        throw error.response.data.error.message;
      });
  };
};

export const settingsChangePassword = ({oldPassword, newPassword}) => {
  return async (dispatch) => {
    await axios.post(`${API_URL}/users/change-password`, {oldPassword, newPassword},
      {headers: {authorization: localStorage.getItem('token')}})
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error.response.data.error.message;
      });
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    await axios.get(`${API_URL}/users/`, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({type: type.GET_USERS_SUCCESS, payload: response.data});
      })
      .catch(error => {
        dispatch({type: type.GET_USERS_ERROR, payload: error.response.data.error.message});
      });
  }
};

export const updateUser = async (data) => {
  await axios.patch(`${API_URL}/users/${data.id}`, data,
    {headers: {authorization: TOKEN}})
    .then(response => {
      return response.data
    })
    .catch(error => {
      throw error.response.data.error.message;
    });
};

export const toggleAdmin = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/${id}/toggleAdmin`,
      {headers: {authorization: TOKEN}})
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error.response.data.error.message);
      });
  });
};

export const toggleEditor = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/${id}/toggleEditor`,
      {headers: {authorization: TOKEN}})
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error.response.data.error.message);
      });
  });
};

export const signOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('uid');
  localStorage.removeItem('ttl');
  TOKEN = null;
  UID = null;
  History.push('/signin');
  return {type: type.UNAUTH_USER};
};

