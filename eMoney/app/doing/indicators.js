// @flow
import {dispatch} from './store';
import {OP_CHANGE_APP_INDICATOR, OP_CHANGE_NET_INDICATOR} from '../constants';

export default {
    setAppState: (state: string) => {
        if (typeof state !== 'string') {
            return;
        }
        dispatch({type: OP_CHANGE_APP_INDICATOR, payload: state});
    },
    setNetState: (state: string) => {
        if (typeof state !== 'string') {
            return;
        }
        dispatch({type: OP_CHANGE_NET_INDICATOR, payload: state});
    },
};
