import {CHANGEPASSWORD_ERROR, CHANGEPASSWORD_SUCCESS} from '../actions/types';

export const reducer = (state = {}, action) => {

  switch (action.type) {
    case CHANGEPASSWORD_ERROR:
      return {...state, error: action.payload}
    case CHANGEPASSWORD_SUCCESS:
      return {...state, success: action.payload}
    default:
      return state;
  }
};
