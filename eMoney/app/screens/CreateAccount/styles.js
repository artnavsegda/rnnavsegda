// @flow
import type {Theme} from '../../themes';
import {NAV_BAR_HEIGHT} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        bps: {
            panel: {
                backgroundColor: theme.colors.primaryBackground,
            },
            backdrop: {
                backgroundColor: 'rgba(0,0,0,0.6)',
            },
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            height: NAV_BAR_HEIGHT,
            paddingLeft: NAV_BAR_HEIGHT,
        },
        currencies: {
            marginTop: 8,
            flexWrap: 'wrap',
            marginBottom: 24,
            flexDirection: 'row',
        },
        currencyItem: {
            marginRight: 8,
            marginBottom: 8,
        },
        currency: {
            paddingTop: 9,
            paddingBottom: 8,
        },
        closeIcon: {
            width: 14,
            height: 14,
            tintColor: theme.colors.primaryText,
        },
        closeButton: {
            height: NAV_BAR_HEIGHT,
            width: NAV_BAR_HEIGHT * 0.999,
            borderRadius: NAV_BAR_HEIGHT / 2,
        },
        content: {
            paddingHorizontal: 20,
        },
        loader: {
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        webView: {
            width: '100%',
            height: '100%',
            marginBottom: 24,
            backgroundColor: 'transparent',
        },
    };
}
