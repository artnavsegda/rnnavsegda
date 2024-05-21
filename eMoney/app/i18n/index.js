import _ from 'lodash';
import axios from 'axios';
import I18n from 'i18n-js';
import {memo} from 'react';
import Moment from 'moment';
import {connect} from 'react-redux';
import type {ReduxState} from '../reducers';

import ru from './translations/ru';
import en from './translations/en';
import kk from './translations/kk';

import 'moment/min/locales.min';

I18n.fallbacks = true;
I18n.locale = '';
I18n.defaultLocale = 'ru';
I18n.translations = {en, ru, kk};
I18n.languageTags = ['ru', 'ru-RU', 'ru-MO', 'en', 'en-EN', 'en-US', 'en-GB', 'en-CA', 'kk', 'kk-KZ'];

// noinspection JSUnresolvedVariable
I18n.pluralization.ru = function(count) {
    const key =
        count === 0
            ? 'zero'
            : count % 10 === 1 && count % 100 !== 11
            ? 'one'
            : [2, 3, 4].indexOf(count % 10) >= 0 && [12, 13, 14].indexOf(count % 100) < 0
            ? 'few'
            : count % 10 === 0 || [5, 6, 7, 8, 9].indexOf(count % 10) >= 0 || [11, 12, 13, 14].indexOf(count % 100) >= 0
            ? 'many'
            : 'other';
    return [key];
};

/**
 *
 * @param {string} locale
 * @returns {string}
 */
const I18nLocaleToMoment = (locale = 'en') => {
    if (locale.includes('-')) {
        return _.first(locale.split('-')) || locale;
    }
    if (locale.includes('_')) {
        return _.first(locale.split('_')) || locale;
    }
    return locale;
};

export const I18nBridge = connect((state: ReduxState) => ({
    language: state.theme.locale || I18n.defaultLocale,
}))(memo(({language, children}: any) => children(language)));

/**
 * @param {string} locale
 */
const changeLocale = locale => {
    if (I18n.locale === locale) {
        return;
    }
    I18n.locale = locale;
    axios.defaults.headers.common = {
        ...axios.defaults.headers.common,
        'Accept-Language': locale,
    };
    Moment.locale(I18nLocaleToMoment(I18n.currentLocale()));
};

// Выставляем локализацию по умолчанию
changeLocale(I18n.defaultLocale);

// noinspection JSUnusedGlobalSymbols
export default {
    languageTags: I18n.languageTags,
    defaultLocale: I18n.defaultLocale,
    currentLocale: () => I18n.locale,
    /**
     * @param {string|array} text
     * @param {object|string|number} options
     * @returns {string}
     */
    t: (text, options = null) => {
        // noinspection JSUnresolvedFunction
        return I18n.t(text, {
            defaultValue: `${text}`,
            ...(options || {}),
        });
    },
    /**
     * @param {number|string} number
     * @param {object|null} options
     * @param {number} options.precision - defaults to 3
     * @param {string} options.separator - defaults to .
     * @param {string} options.delimiter - defaults to ,
     * @param {boolean} options.strip_insignificant_zeros - defaults to false
     * @returns {string}
     */
    toNumber: (number, options = null) => {
        // noinspection JSUnresolvedFunction
        return I18n.toNumber(number, options);
    },
    /**
     * @param {number|string} number
     * @param {object|null} options
     * @returns {string}
     */
    toPercentage: (number, options = null) => {
        // noinspection JSUnresolvedFunction
        return I18n.toPercentage(number, options);
    },
    /**
     * @param {number|string} number
     * @param {object|null} options
     * @param {number} options.precision - defaults to 1
     * @param {string} options.separator - defaults to .
     * @param {string} options.delimiter - defaults to ""
     * @param {boolean} options.strip_insignificant_zeros - defaults to false
     * @param {string} options.format - defaults to %n%u
     * @returns {string}
     */
    toHumanSize: (number, options = null) => {
        // noinspection JSUnresolvedFunction
        return I18n.toHumanSize(number, options);
    },
    changeLocale,
};
