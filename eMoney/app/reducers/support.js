//@flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_SUPPORT_GET_ITEMS, API_SUPPORT_SEND_MESSAGE, type SupportMessage} from '../constants';

export type ReduxState = {
    [id: number]: SupportMessage,
};

const reducer = handleActions(
    {
        [_SUCCESS(API_SUPPORT_GET_ITEMS)]: (state: ReduxState, {reload, payload}: any) => ({
            ...(!reload ? state : {}),
            ...(payload || []).reduce((m: any, message: SupportMessage) => {
                message.index = message.date;
                m[message.id] = message;
                return m;
            }, {}),
        }),
        [_SUCCESS(API_SUPPORT_SEND_MESSAGE)]: (state: ReduxState, {payload}: any) => ({
            ...state,
            ...(payload && payload.date
                ? {
                      [payload.id]: {
                          ...payload,
                          index: payload.date,
                      },
                  }
                : {}),
        }),
    },
    {},
);

export default reducer;
