import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import rootReducer from '../src/reducer';
import { createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';

const persistedState = (typeof localStorage.getItem('hsa') !== "undefined") ? JSON.parse(localStorage.getItem('hsa')) : null;

const connectWithReduxMiddleWare = applyMiddleware(promiseMiddleware)(createStore);
const store = (persistedState != null)? connectWithReduxMiddleWare(rootReducer, persistedState): connectWithReduxMiddleWare(rootReducer);

store.subscribe(() => {
    localStorage.setItem('hsa', JSON.stringify(store.getState()));
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,
    document.getElementById('root'));
registerServiceWorker();