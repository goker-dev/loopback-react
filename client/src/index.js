import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import reduxThunk from 'redux-thunk';
import {BrowserRouter, Router} from 'react-router-dom';


import History from './history.js';
import Routes from './routes';

import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';
import {getSession} from './actions';
import * as type from "./actions/types";


/*
// UNCOMMENT IT FOR PRODUCTION
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);
*/

/* COMMENT IT OUT FOR PRODUCTION */
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(reduxThunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

getSession((me) => {
  me && store.dispatch({type: type.AUTH_USER, payload: me});
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Router history={History}>
            <Routes/>
        </Router>
      </BrowserRouter>
    </Provider>, document.getElementById('root'));
  registerServiceWorker();
});
