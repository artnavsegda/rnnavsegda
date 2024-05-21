import {buildApiRequest} from './utils';
import {checkResponseWithObject} from './response';

const getRequest = () =>
    buildApiRequest({
        method: 'GET',
        target: '/exchangerates',
    }).withResponseChecker(checkResponseWithObject);

export default {
    getRequest,
};
