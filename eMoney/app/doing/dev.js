// @flow
import {dispatch} from './store';
import {OP_DEV_CHANGE_LOCALE} from '../constants';

export default {
    setLocale: (locale: string) => {
        dispatch({type: OP_DEV_CHANGE_LOCALE, payload: locale});
    },
};
