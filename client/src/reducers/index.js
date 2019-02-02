import {combineReducers} from 'redux';
import {reducer as authReducer} from './auth';
import {reducer as userReducer} from './user';
import {reducer as usersReducer} from './users';
import {reducer as settingsReducer} from './settings';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
    form: formReducer,
    auth: authReducer,
    user: userReducer,
    users: usersReducer,
    settings: settingsReducer
});

export default rootReducer;
