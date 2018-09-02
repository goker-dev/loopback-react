import {AUTH_ERROR, AUTH_USER, UNAUTH_USER} from '../actions/types';

export const reducer = (state = {}, action) => {

  switch (action.type) {
    case AUTH_USER:
      return {...state, error: '', authenticated: true, me: action.payload}
    case UNAUTH_USER:
      return {...state, authenticated: false, me: false}
    case AUTH_ERROR:
      return {...state, error: action.payload}
    default:
      return state;
  }
};
