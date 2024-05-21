// @flow
import type {Theme} from '../../themes';
import {BOTTOM_SPACE, NAV_BAR_HEIGHT} from '../../constants';

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
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        closeButton: {
            height: NAV_BAR_HEIGHT,
            width: NAV_BAR_HEIGHT * 0.999,
            borderRadius: NAV_BAR_HEIGHT / 2,
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
        typeBlock: {
            width: 46,
            height: 46,
            marginRight: 16,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.notifications,
        },
        infoFill: {
            backgroundColor: theme.colors.history,
        },
        warningFill: {
            backgroundColor: theme.colors.bonuses,
        },
        errorFill: {
            backgroundColor: theme.colors.notifications,
        },
        successFill: {
            backgroundColor: theme.colors.history,
        },
        typeIcon: {
            width: 30,
            height: 30,
            tintColor: theme.colors.primaryBackground,
        },
    };
}
