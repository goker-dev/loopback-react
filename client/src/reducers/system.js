import {DATA, ERROR, FILE, SUCCESS} from '../actions/types';

export const reducer = (state = {}, action) => {
    switch (action.type) {
        case SUCCESS:
            return {...state, error: '', message: action.payload};
        case DATA:
            return {...state, error: '', message: '', data: action.payload};
        case FILE:
            return {...state, error: '', message: '', file: action.payload};
        case ERROR:
            return {...state, error: action.payload, message: ''};
        default:
            return state;
    }
};
