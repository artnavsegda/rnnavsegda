import {defArray} from '../utils';
import {buildApiRequest} from './utils';
import {API_ADVERTISING} from '../constants';

const fetchAdvertising = () =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/advertising',
        action: API_ADVERTISING,
    });

export default {
    fetchAdvertising,
};
