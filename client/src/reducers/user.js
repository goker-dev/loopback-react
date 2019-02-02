import {GET_USER_ERROR, GET_USER_SUCCESS} from '../actions/types';

export const reducer = (state = {}, action) => {

    switch (action.type) {
        case GET_USER_SUCCESS:
            return {...state, error: '', data: action.payload};
        case GET_USER_ERROR:
            return {...state, error: action.payload};
        default:
            return state;
    }
};
