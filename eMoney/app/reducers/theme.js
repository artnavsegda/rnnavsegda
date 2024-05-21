// @flow
import {handleActions} from 'redux-actions';
import {REHYDRATE} from 'redux-persist/lib/constants';
import {
    _SUCCESS,
    API_AUTH,
    API_CLIENT_EDIT,
    OP_CHANGE_THEME,
    API_CLIENT_LOGOFF,
    API_GET_CLIENT_INFO,
    OP_DEV_CHANGE_LOCALE,
} from '../constants';

import i18n from '../i18n';

export type ReduxState = {
    name: 'light' | 'dark',
    locale: string, // Локализация языка
    language: string, // Язык
    clientLanguage?: string, // Язык клиента
};

const reducer = handleActions(
    {
        [REHYDRATE]: (state: ReduxState, {payload}: any) => {
            payload && payload.theme && payload.theme.locale && i18n.changeLocale(payload.theme.locale);
            return state;
        },
        [OP_CHANGE_THEME]: (state, action) => ({
            ...state,
            name: action.payload === 'auto' ? (state.name === 'light' ? 'dark' : 'light') : action.payload,
        }),
        [OP_DEV_CHANGE_LOCALE]: (state, {payload}) => {
            if (__DEV__) {
                i18n.changeLocale(payload);
                return {
                    ...state,
                    locale: payload,
                };
            }
            return state;
        },
        [_SUCCESS(API_GET_CLIENT_INFO)]: (state: ReduxState, {payload}: any) => {
            i18n.changeLocale(payload.language || state.locale);
            return {
                ...state,
                clientLanguage: payload.language,
                locale: payload.language || state.locale,
            };
        },
        [_SUCCESS(API_CLIENT_EDIT)]: (state: ReduxState, {form}: any) => {
            if (!form.language) {
                return state;
            }
            i18n.changeLocale(form.language);
            return {
                ...state,
                locale: form.language,
                clientLanguage: form.language,
            };
        },
        [_SUCCESS(API_CLIENT_LOGOFF)]: (state: ReduxState) => {
            i18n.changeLocale(state.language || state.locale);
            return {
                ...state,
                clientLanguage: null,
                locale: state.language || state.locale,
            };
        },
        [_SUCCESS(API_AUTH)]: (state: ReduxState, {payload}) => {
            if (!payload.language) {
                return state;
            }
            i18n.changeLocale(state.clientLanguage || payload.language);
            return {
                ...state,
                language: payload.language,
                locale: state.clientLanguage || payload.language,
            };
        },
    },
    {
        name: 'light',
        locale: 'ru',
        language: 'ru',
        clientLanguage: null,
    },
);

export default reducer;
