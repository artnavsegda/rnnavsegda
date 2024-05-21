//@flow
import _ from 'lodash';
import {Store} from 'redux';
import {batch} from 'react-redux';
import type {ReduxState} from '../reducers';
import {getFetchingInfo, hasFetchingKey, OP_CHANGE_FETCHING} from '../constants';

// Любое хранилище у которого есть метод dispatch и getState()
let _store: Store = null;

type Action = {
    [key: string]: any,
    type: string,
};

/*
const hasValidTrackingError = (action: any): boolean => {
    // noinspection JSUnresolvedVariable
    if (action && action.isNetworkError) {
        const status = (action.response || {}).status || 0;
        return status > 0 && (status <= 100 || status >= 500);
    }
    return action;
};
*/

const dispatch = (action: ?Action): any => {
    if (!action || !_store) {
        return;
    }
    if (hasFetchingKey(action.type)) {
        return batch(() => {
            _store.dispatch(action);
            _store.dispatch({
                ...getFetchingInfo(action.type),
                ...(!_.isUndefined(action._pfx)
                    ? {
                          _pfx: action._pfx,
                      }
                    : {}),
                type: OP_CHANGE_FETCHING,
            });
        });
    }
    _store.dispatch(action);
};

const setStore = (store: Store): Store => {
    if (store) {
        _store = store;
    }
    return store;
};

// noinspection JSUnusedGlobalSymbols
const getState = (): ReduxState => {
    if (_store) {
        return _store.getState();
    }
    return {};
};

export {Store, setStore, getState, dispatch};
