// @flow
import type {Theme} from '../../../themes';
import Color from 'color';
import {BOTTOM_SPACE} from '../../../constants';
import {elevationStyle} from '../../../themes';
import {getBottomSpace} from 'react-native-iphone-x-helper';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        content: {
            flex: 1,
            paddingTop: 84,
            paddingBottom: getBottomSpace() + 16,
            backgroundColor: theme.colors.primaryBackground,
        },
        preview: {
            flex: 1,
            backgroundColor: '#000',
        },
        fixedNavBar: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            position: 'absolute',
            paddingRight: 8,
            right: 0,
            left: 0,
            top: 0,
        },
        clientBlock: {
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            paddingHorizontal: 40,
            paddingBottom: 20 + BOTTOM_SPACE,
        },
        clientButton: {
            alignSelf: 'stretch',
            backgroundColor: '#f8f8f8',
            ...elevationStyle(10),
        },
        clientImage: {
            width: 48,
            height: 48,
            marginRight: 12,
            borderRadius: 24,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
        },
    };
}
