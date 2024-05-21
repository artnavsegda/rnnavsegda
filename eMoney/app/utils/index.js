/* flow-disable */
import _ from 'lodash';
import Moment from 'moment';
import {AxiosTransformer} from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Navigation} from 'react-native-navigation';
import {MaskService} from 'react-native-masked-text';
import {Platform, Animated, Dimensions} from 'react-native';
import {PHONE_MASK, STATUS_BAR_HEIGHT, emptyArray, emptyObject} from '../constants';
import * as R from 'ramda';

export * from './scrollSynchronizer';
export * from './cacheStore';
export * from './appRate';

export const dateTimeRx = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/);
export const emailRx = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/,
);

// noinspection JSUnusedGlobalSymbols
export const isTablet: boolean = DeviceInfo.isTablet();

// noinspection JSUnusedLocalSymbols
export function checkSmallDevice(d: string, l?: ?{width: number, height: number}) {
    switch (d.toLowerCase()) {
        case 'iphone 4':
        case 'iphone 4s':
        case 'iphone 5':
        case 'iphone 5s':
        case 'iphone se':
        case 'iphone 5se':
            return true;
        default:
            return false;
    }
}

export const isSmallDevice: boolean = checkSmallDevice(DeviceInfo.getModel(), Dimensions.get('screen'));

// noinspection JSUnusedGlobalSymbols
export const contentScaleFactor: number = Platform.select({
    ios: isSmallDevice ? 0.6 : 1,
    android: 1,
});
// noinspection JSUnusedGlobalSymbols
export const fontScaleFactor: number = Platform.select({
    ios: isSmallDevice ? 0.825 : 1,
    android: 1,
});

export function def(v: any, d: any = null): any {
    return _.isUndefined(v) || _.isNaN(v) ? d : v;
}

// Для оптимизации названий ключей
function optimizeKey(key: string, camelKey: string): string {
    switch (key) {
        case 'ID':
        case 'UID':
        case 'GUID':
        case 'EMail':
            return key.toLowerCase();
        case 'ConfirmedEMail':
            return 'confirmedEmail';
        case 'SMSTimer':
            return 'smsTimer';
        default:
            return camelKey;
    }
}

function isDateTimeKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return lowerKey.includes('time') || lowerKey.includes('date') || lowerKey === 'start' || lowerKey === 'finish';
}

/**
 * Преобразование имен полей объектов в camel case
 */
export function toObjectCamel(o: any, parentKey: ?string = null, parseDates: boolean = true): any {
    if (_.isArray(o)) {
        let res = [];
        for (const x in o) {
            // noinspection JSUnfilteredForInLoop
            res.push(toObjectCamel(o[x], parentKey, parseDates));
        }
        return res;
    }
    if (_.isObject(o)) {
        return _.transform(
            o,
            (result: any, value: any, key: string) => {
                const optimizedKey = optimizeKey(key, _.camelCase(key));
                result[optimizedKey] = toObjectCamel(value, optimizedKey, parseDates);
            },
            {},
        );
    }
    if (_.isString(o) && parseDates && parentKey && isDateTimeKey(parentKey) && (!dateTimeRx || dateTimeRx.test(o))) {
        return def(Moment(o).utc(false).valueOf(), o);
    }
    return o;
}

// noinspection JSUnusedLocalSymbols
export const axiosCamelTransformer: AxiosTransformer = (data: any, headers?: any): any => {
    try {
        return toObjectCamel(JSON.parse(data), null, true);
    } catch (e) {
        return data;
    }
};

export function getMessage(obj: any, d: string = 'Unknown'): any {
    if (_.isString(obj)) {
        return obj;
    }
    if (_.isObject(obj) && 'message' in obj) {
        return obj.message;
    }
    return d;
}

// noinspection JSUnusedGlobalSymbols
export function getErrorInfo(error: any): any {
    if (!error) {
        return {};
    }
    return {
        ...(error.isAxiosError
            ? {
                  response: {
                      data: (error.response || {}).data || {},
                      status: (error.response || {}).status || 0,
                  },
                  isNetworkError: true,
              }
            : {}),
        message: getMessage(error),
    };
}

// noinspection JSUnusedGlobalSymbols
export function defObject(obj: any, _def: any = null): any {
    if (obj && _.isObject(obj)) {
        return obj;
    }
    return _def;
}

// noinspection JSUnusedGlobalSymbols
export function defArray(array: any, _def: any = emptyArray): any[] {
    if (array && _.isArray(array) && !_.isString(array)) {
        return array;
    }
    return _def;
}

// noinspection JSUnusedGlobalSymbols
export function defArrayItem(array: any, index: number = 0, _def: any = 0): any {
    if (!array) {
        return _def;
    }
    if (!_.isArray(array)) {
        return array;
    }
    if (index >= 0 && index < array.length) {
        return array[index] || _def;
    }
    return _def;
}

// noinspection JSUnusedGlobalSymbols
export const checkEmptyArray = (array: any[] = [], _def: any = [null]): any[] => (array.length < 1 ? _def : array);

// noinspection JSUnusedGlobalSymbols
export const optimizedCall = (method: any, args: ?any = undefined): void => {
    if (!_.isFunction(method)) {
        return;
    }
    if (!args) {
        requestAnimationFrame(method);
        return;
    }
    requestAnimationFrame(() => (_.isArray(args) ? method(...args) : method(args)));
};

// noinspection JSUnusedGlobalSymbols
export const doneByPromise = (promise: Promise<any>, callback: () => void) => {
    promise
        .then(() => {})
        .catch(() => {})
        .then(callback);
};

// noinspection JSUnusedGlobalSymbols
export const compareFnByIndex = (a: any, b: any) => (a && b ? (a.index || 0) - (b.index || 0) : 0);

// noinspection JSUnusedGlobalSymbols
export const compareFnByInvertedIndex = (a: any, b: any) => (a && b ? (b.index || 0) - (a.index || 0) : 0);

// noinspection JSUnusedGlobalSymbols
export const compareKeysFnByIndexForMap = (map: {[key: any]: any}) => (a: any, b: any) =>
    map && a && b ? ((map[a] || emptyObject).index || 0) - ((map[b] || emptyObject).index || 0) : 0;

// noinspection JSUnusedGlobalSymbols
export function reformatPhoneNumber(phoneNumber: ?string, allowPlus: boolean = false): string {
    const prefix = (_.first((phoneNumber || '').trim()) || '') === '+' && allowPlus ? '+' : '';
    const n = `${phoneNumber || ''}`.replace(/(\W+)/gi, '');
    if (n.length < 1) {
        return `${prefix}${n}`;
    }
    if (n[0] === '8') {
        return `${prefix}7${n.slice(1)}`;
    }
    return `${prefix}${n}`;
}

// noinspection JSUnusedGlobalSymbols
export function optimizeLayout(layout: {width: number, height: number}, threshold: number = 1): any {
    // noinspection JSSuspiciousNameCombination
    return {
        ...layout,
        width: (Math.floor(layout.width / threshold) || 0) * threshold,
        height: (Math.floor(layout.height / threshold) || 0) * threshold,
    };
}

// noinspection JSUnusedGlobalSymbols
export function exportBorderRadiusStyle(style: any): any {
    if (!style) {
        return null;
    }
    const res: any = {};
    if (_.isArray(style)) {
        _.values(style).forEach((item: any) => {
            if (!item) {
                return;
            }
            const chunk = exportBorderRadiusStyle(item);
            if (chunk && _.size(chunk) > 0) {
                _.merge(res, chunk);
            }
        });
        return res;
    }
    _.keys(style).forEach((key: string) => {
        // noinspection SpellCheckingInspection
        if (key.includes('border') && key.includes('adius')) {
            res[key] = style[key];
        }
    });
    return res;
}

export function isValidEmail(email: string, allowEmpty: boolean = false): boolean {
    if (!email) {
        return allowEmpty;
    }
    if (email.length < 1) {
        return allowEmpty;
    }
    if (!emailRx.test(email)) {
        return false;
    }
    const [account, address] = email.split('@');
    if (account.length > 64) {
        return false;
    }
    return !address.split('.').some(function (part) {
        return part.length > 63;
    });
}

export function fetchingKey(action: string, _pfx?: any, withTime: boolean = false): string {
    return `${action}${_pfx ? `-${_pfx}` : ''}${withTime ? '@t' : ''}`;
}

export const formatNumber = (text: string, allowEmptyEnd: boolean = true) => {
    if (text.length < 1) {
        return text;
    }
    const parts = text.trim().split(/[,.]/gm);
    if (parts.length > 0) {
        const n = parseInt(parts[0].trim(), 10) || 0;
        if (parts.length < 2) {
            return `${n}`;
        }
        const hasEnd = parts[1].trim().length > 0;
        if (hasEnd || allowEmptyEnd) {
            return `${n}.${hasEnd ? parts[1].replace(/(\W+)/gi, '') : ''}`;
        }
        return `${n}`;
    }
    return `${parseInt(text.trim(), 10) || 0}`;
};

export const formatCardNumber = (text: string) => {
    return MaskService.toMask('credit-card', reformatPhoneNumber(text.trim(), true));
};

export const formatPhone = (text: string) => {
    return MaskService.toMask('custom', reformatPhoneNumber(text.trim(), true), {mask: PHONE_MASK});
};

// noinspection JSUnresolvedVariable
export function overlapScreenScrollValue(value: Animated.Value, otherSize?: Animated.Value | number): Animated.Value {
    // noinspection JSUnresolvedVariable,JSUnresolvedFunction
    const next: Animated.Value = Animated.subtract(value, STATUS_BAR_HEIGHT);
    if (otherSize) {
        // noinspection JSUnresolvedFunction
        return Animated.subtract(next, otherSize);
    }
    return next;
}

export function navigate(componentId: any, layout: any): Promise<any> {
    if (!componentId) {
        return Navigation.showModal(layout);
    }
    return Navigation.push(componentId, layout);
}

export function getPictureFlagName(themeName) {
    const pictureName = R.cond([
        [R.equals('light'), R.always('picture')],
        [R.equals('dark'), R.always('pictureBlack')],
        [R.T, R.always('picture')],
    ]);

    return pictureName(themeName);
}

/* flow-enable */
