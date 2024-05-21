//@flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_AUTH, type Partition} from '../constants';

export type ReduxState = {
    [code: string]: Partition,
};

const reducer = handleActions(
    {
        [_SUCCESS(API_AUTH)]: (state, {partitions}) =>
            (partitions || []).reduce((m: any, part: Partition, index: number) => {
                part.index = index;
                m[part.code] = part;
                return m;
            }, {}),
    },
    {},
);

export default reducer;
