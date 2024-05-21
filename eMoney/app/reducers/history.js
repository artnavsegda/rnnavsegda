// @flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_HISTORY_GET_ITEMS, type HistoryItem} from '../constants';

export type ReduxState = {
    items: {[id: number]: HistoryItem},
    lastId: number,
};

const reducer = handleActions(
    {
        [_SUCCESS(API_HISTORY_GET_ITEMS)]: (state: ReduxState, {payload, lastId}: any) => {
            const next = (payload || []).reduce(
                (m: any, item: HistoryItem) => {
                    item.index = item.date;
                    m.items[item.id] = item;
                    m.lastId = item.id;
                    return m;
                },
                {lastId: 0, items: {}},
            );
            if (!lastId) {
                return next;
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    ...next.items,
                },
                lastId: next.lastId,
            };
        },
    },
    {},
);

export default reducer;
