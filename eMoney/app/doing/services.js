import _ from 'lodash';
import {AxiosResponse} from 'axios';
import {buildApiRequest} from './utils';
import {defArray, defObject} from '../utils';
import {API_SERVICES_GET_GROUPS, API_SERVICES_GET_GROUP_ITEMS, API_SERVICES_FIND_INFO_BY_ID} from '../constants';

import accounts from './accounts';
import {checkResponseWithObject} from './response';

const getGroupsRequest = () =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/services/groups',
        action: API_SERVICES_GET_GROUPS,
    });

const getRequest = (groupId: number) =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/services',
        outlets: {groupId},
        options: {
            params: {
                ServiceGroupID: groupId,
            },
        },
        action: API_SERVICES_GET_GROUP_ITEMS,
        _pfx: groupId,
    });

const findInfoRequest = (serviceId: number) =>
    buildApiRequest({
        method: 'GET',
        defMethod: defObject,
        target: '/service/find',
        outlets: {serviceId},
        options: {
            params: {
                ServiceID: serviceId,
            },
        },
        action: API_SERVICES_FIND_INFO_BY_ID,
        _pfx: serviceId,
    });

const getServiceFormRequest = (serviceId: number) =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/service/form',
        options: {
            params: {
                ServiceID: serviceId,
            },
        },
    });

const filledServiceFormRequest = (
    serviceId: number,
    serviceCode: string,
    accountNumber: string,
    result: {code: string, value: string}[],
) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/service/form/filled',
        data: {
            Points: 0,
            ServiceID: serviceId,
            ServiceCode: serviceCode,
            AccountNumber: accountNumber,
            FilledFields: result.map(item => ({
                Code: item.code,
                Value: item.value,
            })),
        },
    })
        .success(() => accounts.getRequest().start())
        .withResponseChecker(function(response: AxiosResponse): Promise<any> {
            if (!(response.data && _.isObject(response.data))) {
                return Promise.reject(new Error('Invalid response data!'));
            }
            if ('result' in response.data) {
                if (response.data.result >= 0 && response.data.result <= 3) {
                    return Promise.resolve(response);
                }
                if ('errorMessage' in response.data) {
                    return Promise.reject(new Error(response.data.errorMessage));
                }
                if ('message' in response.data) {
                    return Promise.reject(new Error(response.data.message));
                }
                return Promise.reject(new Error(`Response result code is error - ${response.data.result}!`));
            }
            return Promise.resolve(response);
        });

const confirmOperationRequest = (operationId: number, code: string) =>
    buildApiRequest({
        method: 'POST',
        target: '/operation/confirm',
        data: {
            OperationID: operationId,
            Code: code,
        },
    }).withResponseChecker(checkResponseWithObject);

const cancelOperationRequest = (operationId: number) =>
    buildApiRequest({
        method: 'POST',
        target: '/operation/cancel',
        options: {
            params: {
                OperationID: operationId,
            },
        },
    }).withResponseChecker(checkResponseWithObject);

const newOperationVerificationCodeRequest = (operationId: number) =>
    buildApiRequest({
        method: 'GET',
        target: '/operation/newcode',
        options: {
            params: {
                OperationID: operationId,
            },
        },
    }).withResponseChecker(checkResponseWithObject);

export default {
    getRequest,
    findInfoRequest,
    getGroupsRequest,
    getServiceFormRequest,
    cancelOperationRequest,
    confirmOperationRequest,
    filledServiceFormRequest,
    newOperationVerificationCodeRequest,
};
