//@flow
import _ from 'lodash';
import {AxiosResponse} from 'axios';

import i18n from '../i18n';

export function checkResponseWithObject(response: AxiosResponse): Promise<any> {
    if (!(response.data && _.isObject(response.data))) {
        return Promise.reject(new Error(i18n.t('errors.invalidResponse')));
    }
    if ('result' in response.data) {
        if (response.data.result === 0) {
            return Promise.resolve(response);
        }
        if ('error' in response.data) {
            return Promise.reject(new Error(response.data.error));
        } else if ('errorMessage' in response.data) {
            return Promise.reject(new Error(response.data.errorMessage));
        } else if ('message' in response.data) {
            return Promise.reject(new Error(response.data.message));
        }
        return Promise.reject(new Error(i18n.t('errors.unknownResultCode', {code: response.data.result})));
    }
    return Promise.resolve(response);
}

export function hasErrorStatusCode(error: any, statusCode: number): boolean {
    return error && error.response && error.response.status === statusCode;
}
