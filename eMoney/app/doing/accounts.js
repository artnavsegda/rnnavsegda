import {buildApiRequest} from './utils';
import {defArray, defObject} from '../utils';
import {checkResponseWithObject} from './response';
import {API_ACCOUNT_CREATE, API_ACCOUNTS_GET, API_AVAILABLE_CURRENCIES} from '../constants';

const getAvailableCurrenciesRequest = () =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/currency',
        action: API_AVAILABLE_CURRENCIES,
    });

const getRequest = () =>
    buildApiRequest({
        method: 'GET',
        defMethod: defArray,
        target: '/accounts',
        action: API_ACCOUNTS_GET,
    });

const createRequest = (currency: string) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/account/create',
        outlets: {currency},
        options: {
            params: {
                CurrencyAlfa3: currency,
            },
        },
        action: API_ACCOUNT_CREATE,
    }).withResponseChecker(checkResponseWithObject);

const transferRequest = (accountFrom: string, accountTo: string, price: number) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/accounts/transfer',
        data: {
            AccountFrom: accountFrom,
            AccountTo: accountTo,
            Price: price,
        },
    })
        .withResponseChecker(checkResponseWithObject)
        .success(() => getRequest().start());

const rechargeRequest = (account: string, cardNumber: number, price: number) =>
    buildApiRequest({
        method: 'POST',
        defMethod: defObject,
        target: '/accounts/recharge',
        data: {
            CardNumber: cardNumber,
            Account: account,
            Price: price,
        },
    })
        .withResponseChecker(checkResponseWithObject)
        .success(() => getRequest().start());

export default {
    getRequest,
    createRequest,
    transferRequest,
    rechargeRequest,
    getAvailableCurrenciesRequest,
};
