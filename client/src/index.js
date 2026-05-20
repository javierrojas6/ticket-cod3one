import React  from 'react';
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import history from 'lib-app/history';

import SessionActions from 'actions/session-actions';
import ConfigActions from 'actions/config-actions';
import searchFiltersActions from 'actions/search-filters-actions';

import routes from 'app/Routes';
import store from 'app/store';

import { updateSearchTicketsFromURL } from './app/admin/panel/tickets/admin-panel-search-tickets';

import './main.scss';

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};

if (process.env.NODE_ENV !== 'production') {
    // Enable React devtools
    window.React = React;
}

if (process.env.FIXTURES) {
    require('lib-app/fixtures-loader');
}

const StartupError = ({message}) => (
    <div className="startup-error">
        <h1>OpenSupports could not reach the API</h1>
        <p>{message || 'Unable to load the initial application data.'}</p>
        <p>Check the backend status or update the frontend endpoint configuration.</p>
        <p>Current API root: {apiRoot}</p>
    </div>
);

const swallowStartupError = error => {
    if (showLogs) {
        console.warn('Startup request failed', error);
    }

    return error;
};

const dispatchStartupAction = action => {
    const dispatchResult = store.dispatch(action);

    if (dispatchResult && typeof dispatchResult.catch === 'function') {
        dispatchResult.catch(swallowStartupError);
    }

    return dispatchResult;
};

let renderApplication = function () {
    const application = store.getState().config.initError
        ? <StartupError message={store.getState().config.initError} />
        : <Provider store={store}>{routes}</Provider>;

    render(application, document.getElementById('app'));
};
window.store = store;

let unsubscribe = store.subscribe(() => {
    if(showLogs) console.log(store.getState());

    if (store.getState().session.initDone && store.getState().config.initDone) {
        unsubscribe();
        renderApplication();
    }
});

history.listen(() => {
    store.dispatch(searchFiltersActions.setLoadingInTrue());
    updateSearchTicketsFromURL();
});

dispatchStartupAction(ConfigActions.checkInstallation());
dispatchStartupAction(ConfigActions.init());
dispatchStartupAction(SessionActions.checkSession());
