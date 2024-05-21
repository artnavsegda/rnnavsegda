// @flow
import {themeByName, type Theme} from '../themes';
import {dispatch, getState} from './store';
import {OP_CHANGE_THEME} from '../constants';

export default {
    change: (name: 'auto' | 'light' | 'dark' = 'auto') => {
        dispatch({type: OP_CHANGE_THEME, payload: name});
    },
    currentTheme: (): Theme => themeByName(getState().theme.name),
};
