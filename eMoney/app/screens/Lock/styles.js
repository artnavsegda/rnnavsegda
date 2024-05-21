// @flow
import Color from 'color';
import type {Theme} from '../../themes';
import {elevationStyle} from '../../themes';
import {BOTTOM_SPACE, MIN_SCREEN_SIZE, STATUS_BAR_HEIGHT} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme) {
    return {
        container: {
            flex: 1,
            paddingBottom: BOTTOM_SPACE,
            paddingTop: STATUS_BAR_HEIGHT,
            backgroundColor: theme.colors.button,
        },
        block: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        row: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
        },
        button: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatar: {
            aspectRatio: 1,
            marginBottom: 16,
            width: MIN_SCREEN_SIZE * 0.25,
            borderRadius: MIN_SCREEN_SIZE * 0.125,
            ...elevationStyle(14),
        },
        icon: {
            width: 24,
            height: 24,
            tintColor: theme.colors.buttonText,
        },
        clientInfo: {
            alignSelf: 'stretch',
            alignItems: 'center',
            paddingHorizontal: 32,
            justifyContent: 'center',
        },
        inputBlock: {
            minHeight: 56,
            alignItems: 'center',
            flexDirection: 'row',
            width: MIN_SCREEN_SIZE * 0.334,
            justifyContent: 'space-between',
        },
        bullet: (i: number, size: number) => ({
            width: 8,
            height: 8,
            borderRadius: 4,
            opacity: i + 1 <= size ? 1 : 0.2,
            backgroundColor: theme.colors.buttonText,
        }),
    };
}
