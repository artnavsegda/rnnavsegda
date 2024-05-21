// @flow
import Color from 'color';
import type {Theme} from '../../themes';
import {NAV_BAR_HEIGHT} from '../../constants';
import {fontStyles} from '../../components/UIKit/Typography/styles';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    // noinspection JSSuspiciousNameCombination
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
        fullHeader: {
            paddingLeft: 20,
            paddingRight: 20,
        },
        closeButton: {
            height: NAV_BAR_HEIGHT,
            width: NAV_BAR_HEIGHT * 0.999,
            borderRadius: NAV_BAR_HEIGHT / 2,
        },
        content: {
            paddingHorizontal: 20,
        },
        logoBlock: {
            width: '100%',
            aspectRatio: 2,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            height: '100%',
            aspectRatio: 1.15,
        },
        closeIcon: {
            width: 14,
            height: 14,
            tintColor: theme.colors.primaryText,
        },
        input: {
            ...fontStyles.regular,
            flex: 1,
            fontSize: 20,
            color: theme.colors.primaryText,
        },
        inputBlock: {
            minHeight: 44,
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: Color(theme.colors.secondaryText)
                .alpha(0.2)
                .toString(),
        },
        inlineLink: {
            textDecorationLine: 'underline',
        },
        inputHeader: {
            width: '100%',
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    };
}
