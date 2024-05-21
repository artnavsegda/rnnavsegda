//@flow
import Currency from 'currency.js';

function _pattern(t: string = '!#', negativePrefix: string = '-') {
    return {pattern: t, negativePattern: `${negativePrefix}${t}`};
}

const _symbols: {[key: string]: string} = {
    EUR: '€',
    USD: '$',
    JPY: '¥',
    GAS: 'GAS',
    RUB: '₽',
    KZT: '₸',
    KGS: 'с',
    UZS: 'So\'m',
};

const _variants: {[key: string]: (value: any) => Currency} = {
    EUR: (value) => Currency(value, {symbol: '€', precision: 2, separator: ' ', decimal: ','}),
    USD: (value) => Currency(value, {symbol: '$', precision: 2}),
    JPY: (value) => Currency(value, {symbol: '¥', precision: 0}),
    GAS: (value) => Currency(value, {precision: 3}),
    UZS: (value) => Currency(value, {symbol: '', precision: 2}),
    RUB: (value) =>
        Currency(value, {
            ..._pattern('# !'),
            symbol: '₽',
            decimal: ',',
            precision: 2,
            separator: ' ',
        }),
    KZT: (value) =>
        Currency(value, {
            ..._pattern('# !'),
            symbol: '₸',
            decimal: ',',
            precision: 0,
            separator: ' ',
        }),
    KGS: (value) =>
        Currency(value, {
            ..._pattern('# !'),
            symbol: 'с',
            decimal: ',',
            precision: 0,
            separator: ' ',
        }),
};

const currency = (value: any, code: string): Currency => {
    if (code in _variants) {
        return _variants[code](value);
    }
    return Currency(value, {symbol: ''});
};

currency.symbol = (code: string) => (code in _symbols ? _symbols[code] : '');

export default currency;
