import {buildApiRequest} from './utils';
import {defArray, defObject} from '../utils';
import {API_FAQ_GET_ANSWERS, API_FAQ_GET_ITEMS} from '../constants';

const getItemsRequest = () =>
    buildApiRequest({
        method: 'GET',
        target: '/faqs',
        defMethod: defArray,
        action: API_FAQ_GET_ITEMS,
    });

const getAnswersRequest = (questionId: number) =>
    buildApiRequest({
        method: 'GET',
        target: '/faq',
        outlets: {questionId},
        options: {
            params: {
                FAQID: questionId,
            },
        },
        defMethod: defObject,
        action: API_FAQ_GET_ANSWERS,
    });

export default {
    getItemsRequest,
    getAnswersRequest,
};
