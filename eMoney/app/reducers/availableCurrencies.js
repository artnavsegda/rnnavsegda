//@flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_ACCOUNT_CREATE, API_AVAILABLE_CURRENCIES, type AccountCurrency} from '../constants';

export type ReduxState = {[alfa3: string]: AccountCurrency};

const reducer = handleActions(
    {
        [_SUCCESS(API_ACCOUNT_CREATE)]: (state: ReduxState, {currency}: any) => ({
            ...state,
            [currency]: {
                ...(state[currency] || {}),
                isAccount: true,
            },
        }),
        [_SUCCESS(API_AVAILABLE_CURRENCIES)]: (state: ReduxState, {payload}: any) =>
            (payload || []).reduce((m: any, currency: AccountCurrency, index: number) => {
                currency.index = index;
                m[currency.alfa3] = currency;
                return m;
            }, {}),
    },
    {},
);

export default reducer;
