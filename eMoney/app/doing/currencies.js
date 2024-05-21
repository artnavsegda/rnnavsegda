import {buildApiRequest} from './utils';
import {checkResponseWithObject} from './response';

const getRateRequest = (c1: string, c2: string) =>
    buildApiRequest({
        method: 'GET',
        target: '/currency/rate',
        options: {
            params: {
                Currency1: c1,
                Currency2: c2,
            },
        },
    }).withResponseChecker(checkResponseWithObject);

export default {
    getRateRequest,
};
