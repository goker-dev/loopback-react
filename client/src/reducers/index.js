import {combineReducers} from 'redux';
import {reducer as systemReducer} from './system';
import {reducer as authReducer} from './auth';
import {reducer as settingsReducer} from './settings';
//import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
    system: systemReducer,
    //form: formReducer,
    auth: authReducer,
    settings: settingsReducer
});

export default rootReducer;
