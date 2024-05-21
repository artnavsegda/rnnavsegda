// @flow
import {AppState} from 'react-native';
import {handleActions} from 'redux-actions';
import {OP_SET_STATE, OP_CHANGE_APP_INDICATOR, OP_CHANGE_NET_INDICATOR} from '../constants';

export type ReduxState = {
    app: string,
    net: string,
};

const reducer = handleActions(
    {
        [OP_SET_STATE]: (state: ReduxState, action: any) => ({
            ...state,
            ...(action.payload || {}),
            app: state.app,
            net: state.net,
        }),
        [OP_CHANGE_APP_INDICATOR]: (state: ReduxState, action: any) => ({
            ...state,
            app: action.payload || 'active',
        }),
        [OP_CHANGE_NET_INDICATOR]: (state: ReduxState, action: any) => ({
            ...state,
            net: action.payload || 'online',
        }),
    },
    {
        app: AppState.currentState || 'active',
        net: 'online',
    },
);

export default reducer;
