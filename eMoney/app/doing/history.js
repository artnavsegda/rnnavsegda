import {defArray} from '../utils';
import {buildApiRequest} from './utils';
import {API_HISTORY_GET_ITEMS} from '../constants';

const getRequest = (lastId: number = 0, count: number = 100) =>
    buildApiRequest({
        method: 'GET',
        target: '/history',
        defMethod: defArray,
        outlets: {lastId, count},
        action: API_HISTORY_GET_ITEMS,
        options: {
            params: {
                Count: count || 100,
                LastID: lastId || 0,
            },
        },
    });

export default {
    getRequest,
};
