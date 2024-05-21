import {buildApiRequest} from './utils';
import {defObject} from '../utils';
import {checkResponseWithObject} from './response';

const cancelPayInvoice = (operationID: number) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/operation/cancel',
        options: {
            params: {
                OperationID: operationID,
            },
        },
    }).withResponseChecker(checkResponseWithObject);

const confirmPayInvoice = (operationID: number, code: string) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/operation/confirm',

        data: {
            OperationID: operationID,
            Code: code,
        },
    }).withResponseChecker(checkResponseWithObject);

export default {
    cancelPayInvoice,
    confirmPayInvoice,
};
