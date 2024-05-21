// @flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_AUTH} from '../constants';
import {setAuthHeaderByAction} from '../doing/auth';
import {REHYDRATE} from 'redux-persist/lib/constants';

type AuthInfo = {
    smsTimer: number,
    senderId: string,
    language: string,
    startType: number,
    privacyPolicy?: string,
    contractOffer?: string,
};

export type ReduxState = {
    token: ?string,
    info: ?AuthInfo,
};

const reducer = handleActions(
    {
        [REHYDRATE]: (state: ReduxState, {payload}: any) => {
            setAuthHeaderByAction(payload && payload.auth && payload.auth.token ? payload.auth.token : null);
            return state;
        },
        [_SUCCESS(API_AUTH)]: (state, {token, payload}) => ({
            ...state,
            token: setAuthHeaderByAction(token || null),
            info: payload,
        }),
    },
    {
        token: null,
        info: {
            smsTimer: 30,
            senderId: '',
            language: 'ru',
            startType: -1,
        },
    },
);

export default reducer;
