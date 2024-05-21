// @flow
import {handleActions, handleAction} from 'redux-actions';
import {
    APP_ADD_NOTIFICATION,
    APP_DELETE_ALL_NOTIFICATION_BY_TYPE,
    APP_CHANGE_PUSH_NOTIFICATIONS_STATUS,
    type PushMessage,
    API_NOTIFICATIONS_GET_TOP,
    API_NOTIFICATIONS_PUSH_LIST,
    API_NOTIFICATIONS_BONUSES_LIST,
    API_NOTIFICATIONS_PAYMENTS_LIST,
    API_NOTIFICATIONS_CLEAR_NOTIFICATION_LIST,
    _SUCCESS,
} from '../constants';
import * as R from 'ramda';

export type ReduxState = {
    status: false,
    notifications: [],
    notificationHistoryGroups: [],
    historyNotifications: [],
};

const reducer = handleActions(
    {
        [APP_ADD_NOTIFICATION]: (state: ReduxState, {payload}: any) => {
            console.log('ADD MESSAGE - REDUCER', payload);
            const newData = {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        id: R.pathOr(-1, ['id'], payload),
                        type: R.pathOr(-1, ['type'], payload),
                        messageData: R.pathOr({}, ['messageData'], payload),
                    },
                ],
            };

            console.log('ADD MESSAGE - REDUCER - POST', newData);
            return newData;
        },
        [APP_DELETE_ALL_NOTIFICATION_BY_TYPE]: (state: ReduxState, {payload}: any) => {
            console.log('ADD MESSAGE - REDUCER', payload);
            return {
                ...state,
                notifications: state.notifications.map((notification) => {
                    return notification.type !== payload;
                }),
            };
        },
        [API_NOTIFICATIONS_CLEAR_NOTIFICATION_LIST]: (state: ReduxState, {payload}: any) => {
            return {
                ...state,
                historyNotifications: [],
            };
        },
        [APP_CHANGE_PUSH_NOTIFICATIONS_STATUS]: (state: ReduxState, {payload}: any) => {
            return {
                ...state,
                status: payload,
            };
        },
        [_SUCCESS(API_NOTIFICATIONS_GET_TOP)]: (state: ReduxState, {payload}: any) => {
            console.log('NOTIFICATIONS GROUPS', payload);
            return {
                ...state,
                notificationHistoryGroups: payload,
            };
        },
        [_SUCCESS(API_NOTIFICATIONS_PUSH_LIST)]: (state: ReduxState, {payload}: any) => {
            console.log('NOTIFICATIONS PUSH LIST', payload);
            return {
                ...state,
                historyNotifications: payload,
            };
        },
        [_SUCCESS(API_NOTIFICATIONS_BONUSES_LIST)]: (state: ReduxState, {payload}: any) => {
            console.log('NOTIFICATIONS PUSH LIST', payload);
            return {
                ...state,
                historyNotifications: payload,
            };
        },
        [_SUCCESS(API_NOTIFICATIONS_PAYMENTS_LIST)]: (state: ReduxState, {payload}: any) => {
            console.log('NOTIFICATIONS PUSH LIST', payload);
            return {
                ...state,
                historyNotifications: payload,
            };
        },
    },
    {
        status: false,
        notifications: [],
        historyNotifications: [],
    },
);

export default reducer;
