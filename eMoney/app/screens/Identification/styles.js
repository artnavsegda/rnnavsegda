// @flow
import type {Theme} from '../../themes';
import {BOTTOM_SPACE, NAV_BAR_HEIGHT} from '../../constants';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import Color from 'color';

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
        closeButton: {
            height: NAV_BAR_HEIGHT,
            width: NAV_BAR_HEIGHT * 0.999,
            borderRadius: NAV_BAR_HEIGHT / 2,
        },
        loader: {
            minHeight: 128,
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            paddingHorizontal: 20,
        },
        actions: {
            paddingTop: 20,
            flexDirection: 'column',
            paddingBottom: BOTTOM_SPACE > 0 ? 0 : 20,
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
    };
}
