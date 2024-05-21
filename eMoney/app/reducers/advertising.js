// @flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_ADVERTISING, type AdvertisingBlock} from '../constants';
// Utils
import {buildAdvertisingTable, type AdvertisingGroup} from './advertisingUtils';

export type ReduxState = {
    [location: number]: {
        [groupId: number]: AdvertisingGroup,
    },
};

const initState: ReduxState = {};

const reducer = handleActions(
    {
        [_SUCCESS(API_ADVERTISING)]: (state: ReduxState, {payload}: any) => {
            return (payload || []).reduce((m: any, item: AdvertisingBlock, index: number) => {
                if ((item.advertising || []).length > 0) {
                    const location = item.location || 0;
                    if (!(location in m)) {
                        m[location] = {};
                    }
                    m[location][item.id] = {
                        index,
                        location,
                        id: item.id,
                        name: item.name,
                        viewType: item.viewType,
                        items: item.viewType <= 0 ? buildAdvertisingTable(item.advertising) : item.advertising,
                    };
                }
                return m;
            }, {});
        },
    },
    initState,
);

export default reducer;
