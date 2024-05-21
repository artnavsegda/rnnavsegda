// @flow
import type {Theme} from '../../themes';
import {NAV_BAR_HEIGHT} from '../../constants';
import Color from 'color';

export const ITEM_HEIGHT = 68;

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme) {
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
            paddingHorizontal: 20,
            paddingTop: 16,
            height: 48,
        },
        separator: {
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            position: 'absolute',
            backgroundColor: Color(theme.colors.primaryText).alpha(theme.opacity.spoon).toString(),
        },
        item: {
            height: ITEM_HEIGHT,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
        },
        accountNumberBlock: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
        },
        indicatorBlock: {
            alignItems: 'center',
            height: NAV_BAR_HEIGHT,
            justifyContent: 'center',
            width: NAV_BAR_HEIGHT * 0.75,
        },
        indicator: {
            width: 16,
            height: 16,
            tintColor: theme.colors.successText,
        },
    };
}
