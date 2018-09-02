import {GET_USERS_ERROR, GET_USERS_SUCCESS} from '../actions/types';

export const reducer = (state = {}, action) => {

  switch (action.type) {
    case GET_USERS_SUCCESS:
      return {...state, error: '', data: action.payload}
    case GET_USERS_ERROR:
      return {...state, error: action.payload}
    default:
      return state;
  }
};
