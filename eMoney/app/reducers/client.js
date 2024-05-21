//@flow
import {handleActions} from 'redux-actions';
import {
    _REQUEST,
    _SUCCESS,
    FILLED_CODE,
    API_CLIENT_EDIT,
    API_ACCOUNTS_GET,
    API_CLIENT_LOGOFF,
    API_ACCOUNT_CREATE,
    API_GET_CLIENT_INFO,
    OP_CHANGE_ACCESS_HASH,
    API_IDENTIFICATION_CLIENT,
    type ClientInfo,
} from '../constants';

export type ReduxState = {
    info?: ClientInfo,
    accessHash?: string,
    enableBiometrics: boolean,
};

const reducer = handleActions(
    {
        [OP_CHANGE_ACCESS_HASH]: (state: ReduxState, {payload, enableBiometrics}) => ({
            ...state,
            enableBiometrics: !payload ? false : enableBiometrics,
            accessHash: payload === FILLED_CODE ? state.accessHash : payload,
        }),
        [_SUCCESS(API_IDENTIFICATION_CLIENT)]: (state: ReduxState) => ({
            ...state,
            info: {
                ...(state.info || {}),
                identification: 2,
            },
        }),
        [_SUCCESS(API_ACCOUNTS_GET)]: (state: ReduxState, {payload}: any) => ({
            ...state,
            info: {
                ...(state.info || {}),
                accounts: payload || [],
            },
        }),
        [_SUCCESS(API_ACCOUNT_CREATE)]: (state: ReduxState, {payload}: any) => {
            if (!state.info) {
                return state;
            }
            return {
                ...state,
                info: {
                    ...state.info,
                    accounts:
                        (payload.balance || 0) + (payload.points || 0) > 0
                            ? [payload, ...(state.info.accounts || [])]
                            : [...(state.info.accounts || []), payload],
                },
            };
        },
        [_SUCCESS(API_GET_CLIENT_INFO)]: (state, {payload}) => ({
            ...state,
            info: payload,
        }),
        [_SUCCESS(API_CLIENT_EDIT)]: (state: ReduxState, {form}) =>
            state && state.info && (state.info.clientGuid || '').length > 4
                ? {
                      ...state,
                      info: {
                          ...(state.info || {}),
                          ...form,
                      },
                  }
                : state,
        [_REQUEST(API_CLIENT_LOGOFF)]: () => ({
            enableBiometrics: false,
            accessHash: undefined,
            info: null,
        }),
    },
    {
        info: null,
        accessHash: undefined,
        enableBiometrics: false,
    },
);

export default reducer;
