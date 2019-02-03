import {DATA, ERROR, SUCCESS} from '../actions/types';

export const reducer = (state = {}, action) => {
    switch (action.type) {
        case SUCCESS:
            return {...state, error: '', message: action.payload, data: ''};
        case DATA:
            return {...state, error: '', message: '', data: action.payload};
        case ERROR:
            return {...state, error: action.payload, message: '', data: ''};
        default:
            return state;
    }
};
