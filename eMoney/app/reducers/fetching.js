// @flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_CLIENT_LOGOFF, OP_CHANGE_FETCHING} from '../constants';

import {fetchingKey} from '../utils';

export type ReduxState = {
    [key: string]: boolean | number,
};

const reducer = handleActions(
    {
        [_SUCCESS(API_CLIENT_LOGOFF)]: () => ({
            enableBiometrics: false,
            accessHash: undefined,
            info: null,
        }),
        [OP_CHANGE_FETCHING]: (state: ReduxState, {actionType: action, _pfx, fetching}) =>
            (action || '').length < 1
                ? state
                : {
                      ...state,
                      [fetchingKey(action, _pfx)]: fetching || false,
                      [fetchingKey(action, _pfx, true)]: Math.floor(new Date() / 1000),
                  },
    },
    {},
);

export default reducer;
