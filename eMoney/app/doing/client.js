import _ from 'lodash';
import Moment from 'moment';
import {AxiosResponse} from 'axios';
import {doneByPromise} from '../utils';
import {buildApiRequest} from './utils';
import {dispatch, getState} from './store';
import {checkResponseWithObject, hasErrorStatusCode} from './response';
import {
    API_CLIENT_REPEAT_EMAIL_CONFIRM,
    API_CLIENT_REPEAT_SMS_CODE,
    API_IDENTIFICATION_CLIENT,
    API_CLIENT_CONFIRM_LOGIN,
    API_CLIENT_REQUEST_LOGIN,
    OP_CHANGE_ACCESS_HASH,
    API_CLIENT_SET_AVATAR,
    API_GET_CLIENT_INFO,
    API_CLIENT_LOGOFF,
    API_CLIENT_EDIT,
    _SUCCESS,
} from '../constants';

import auth, {setAuthHeaderByAction} from './auth';

function hasAuthClient({client}: any): boolean {
    return client.info && (client.info.clientGuid || '').length > 4;
}

const loginRequest = (phone: number, cb: (ns: number) => any) =>
    buildApiRequest({
        method: 'POST',
        target: '/client/login',
        options: {
            params: {
                ClientPhone: phone,
            },
        },
        action: API_CLIENT_REQUEST_LOGIN,
    })
        .withResponseChecker(checkResponseWithObject)
        .success((data: any) => {
            console.log('LOGIN', data);
            cb('nextStep' in data ? data.nextStep : -1);
        })
        .error((error) => {
            console.log('ERROR CLIENT APP');
        });

const confirmLoginRequest = (step: number, code: string) =>
    buildApiRequest({
        method: 'POST',
        outlets: {step},
        target: '/client/check',
        data: {
            Step: step,
            Code: code,
        },
        action: API_CLIENT_CONFIRM_LOGIN,
    })
        .withResponseChecker(checkResponseWithObject)
        .success(() => infoRequest().start());

const repeatSmsCodeRequest = () =>
    buildApiRequest({
        method: 'POST',
        target: '/client/smscode/new',
        action: API_CLIENT_REPEAT_SMS_CODE,
    }).withResponseChecker(checkResponseWithObject);

const repeatEmailConfirmRequest = () =>
    buildApiRequest({
        method: 'POST',
        target: '/client/email/repeat',
        action: API_CLIENT_REPEAT_EMAIL_CONFIRM,
    }).withResponseChecker(checkResponseWithObject);

const infoRequest = () =>
    buildApiRequest({
        method: 'GET',
        target: '/client/info',
        action: API_GET_CLIENT_INFO,
    })
        .withResponseChecker((response: AxiosResponse): Promise<AxiosResponse> => {
            if (!response.data) {
                return Promise.reject(new Error('Invalid response data object!'));
            }
            if (_.isObject(response.data) && 'clientGuid' in response.data && response.data.clientGuid) {
                return Promise.resolve(response);
            }
            return Promise.reject(new Error('Response client GUID not found!'));
        })
        .error(
            (err: any) =>
                hasErrorStatusCode(err, 401) &&
                hasAuthClient(getState()) &&
                dispatch({type: _SUCCESS(API_CLIENT_LOGOFF)}),
        );

const editRequest = (
    form: {
        name: string,
        city: string,
        email: ?string,
        country: string,
        language: string,
        clientGuid: string,
        phoneNumber: number,
        dateOfBirth: ?number,
        gender: ?(0 | 1 | 2),
    },
    reloadClientInfo: boolean = true,
) =>
    buildApiRequest({
        method: 'POST',
        target: '/client/edit',
        action: API_CLIENT_EDIT,
        outlets: {form, reloadClientInfo},
        data: {
            DateOfBirth:
                (form.dateOfBirth || 0) !== 0 ? `${Moment(form.dateOfBirth || 0).format('YYYY-MM-DD')}T00:00:00` : null,
            ClientGUID: form.clientGuid,
            EMail: form.email || null,
            Phone: form.phoneNumber,
            Gender: form.gender || 0,
            Language: form.language,
            Country: form.country,
            City: form.city,
            Name: form.name,
        },
    })
        .withResponseChecker(checkResponseWithObject)
        .success(() => reloadClientInfo && infoRequest().start());

const setAvatarRequest = (image: {data: any, mime: string, path: string}) =>
    buildApiRequest({
        method: 'POST',
        target: '/client/avatar/set',
        data: JSON.stringify(image.data),
        options: {
            headers: {'Content-Type': 'application/json'},
        },
        action: API_CLIENT_SET_AVATAR,
    }).withResponseChecker(checkResponseWithObject);

const setPasswordRequest = (password: string) =>
    buildApiRequest({
        method: 'POST',
        target: '/client/password/set',
        data: {
            Password: password,
        },
    }).withResponseChecker(checkResponseWithObject);

const forgotPasswordRequest = () =>
    buildApiRequest({
        method: 'POST',
        target: '/client/password/forgot',
    }).withResponseChecker(checkResponseWithObject);

const logoffRequest = () =>
    buildApiRequest({
        method: 'POST',
        target: '/client/logoff',
        action: API_CLIENT_LOGOFF,
    })
        .withResponseChecker(checkResponseWithObject)
        .success(() => {
            setAuthHeaderByAction(null);
            doneByPromise(auth.refreshToken(), () => {});
        });

const disableRequest = () =>
    buildApiRequest({
        method: 'POST',
        target: '/client/disable',
        action: API_CLIENT_LOGOFF,
    }).success(() => {
        setAuthHeaderByAction(null);
        doneByPromise(auth.refreshToken(), () => {});
    });

const findClientRequest = (guid: string) =>
    buildApiRequest({
        method: 'GET',
        target: '/client/find',
        options: {
            params: {
                GUID: guid,
            },
        },
    });

const identificationNewCodeRequest = () =>
    buildApiRequest({
        method: 'GET',
        target: '/client/identification/newcode',
    }).withResponseChecker(checkResponseWithObject);

const identificationCheckCodeRequest = (code: string) =>
    buildApiRequest({
        method: 'GET',
        target: '/client/identification',
        action: API_IDENTIFICATION_CLIENT,
        options: {
            params: {
                CheckCode: code,
            },
        },
    }).withResponseChecker(checkResponseWithObject);

export default {
    infoRequest,
    findClientRequest,
    editRequest,
    loginRequest,
    logoffRequest,
    disableRequest,
    setAvatarRequest,
    setPasswordRequest,
    confirmLoginRequest,
    repeatSmsCodeRequest,
    forgotPasswordRequest,
    repeatEmailConfirmRequest,
    identificationNewCodeRequest,
    identificationCheckCodeRequest,
    changeAccessHash: (hash: string, enableBiometrics: boolean) =>
        dispatch({
            type: OP_CHANGE_ACCESS_HASH,
            enableBiometrics,
            payload: hash,
        }),
};
