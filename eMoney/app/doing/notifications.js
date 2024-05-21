import {dispatch} from './store';
import {
    APP_ADD_NOTIFICATION,
    APP_DELETE_ALL_NOTIFICATION_BY_TYPE,
    APP_CHANGE_PUSH_NOTIFICATIONS_STATUS,
    API_NOTIFICATIONS_GET_TOP,
    API_NOTIFICATIONS_PUSH_LIST,
    API_NOTIFICATIONS_BONUSES_LIST,
    API_NOTIFICATIONS_PAYMENTS_LIST,
    API_NOTIFICATIONS_CLEAR_NOTIFICATION_LIST,
} from '../constants';
import {buildApiRequest} from './utils';

const getRequest = () =>
    buildApiRequest({
        method: 'GET',
        target: '/notifications/top',
        action: API_NOTIFICATIONS_GET_TOP,
    });

const getPushHistory = (type, pageNumber, pageSize) =>
    buildApiRequest({
        method: 'GET',
        target: '/push/list',
        action: API_NOTIFICATIONS_PUSH_LIST,
        options: {
            params: {
                Type: type,
                PageNumber: pageNumber,
                PageSize: pageSize,
            },
        },
    });

const getBonusesHistory = (lastId: number = 0, count: number = 100) =>
    buildApiRequest({
        method: 'GET',
        target: '/bonuses',
        action: API_NOTIFICATIONS_BONUSES_LIST,
        options: {
            params: {
                Count: count || 100,
                LastID: lastId || 0,
            },
        },
    });

const getPaymentsHistory = (lastId: number = 0, count: number = 100) =>
    buildApiRequest({
        method: 'GET',
        target: '/payments',
        action: API_NOTIFICATIONS_PAYMENTS_LIST,
        options: {
            params: {
                Count: count || 100,
                LastID: lastId || 0,
            },
        },
    });

function clearPushHistory() {
    dispatch({type: API_NOTIFICATIONS_CLEAR_NOTIFICATION_LIST});
}

export default {
    addNotification: (message) => {
        console.log('ADD MESSAGE - ACTION', message);
        dispatch({type: APP_ADD_NOTIFICATION, payload: message});
    },
    deleteAllNotificationsByType(type: number) {
        dispatch({type: APP_DELETE_ALL_NOTIFICATION_BY_TYPE, payload: type});
    },
    changePushNotificationsStatus(status: Boolean) {
        dispatch({type: APP_CHANGE_PUSH_NOTIFICATIONS_STATUS, payload: status});
    },
    getRequest,
    getPushHistory,
    clearPushHistory,
    getBonusesHistory,
    getPaymentsHistory,
};
