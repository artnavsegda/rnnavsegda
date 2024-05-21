//@flow
import Color from 'color';
import {elevationStyle, type Theme} from '../../themes';
import {TAB_BAR_HEIGHT, BOTTOM_SPACE, STATUS_BAR_HEIGHT} from '../../constants';

export const ACCOUNT_BUTTON_HEIGHT = 60;

export default function(theme: Theme): any {
    return {
        layout: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            paddingHorizontal: 16,
            paddingTop: STATUS_BAR_HEIGHT,
            backgroundColor: 'rgba(0,0,0,0.2)',
            paddingBottom: TAB_BAR_HEIGHT + BOTTOM_SPACE,
        },
        form: {
            borderRadius: 16,
            paddingVertical: 1,
            ...elevationStyle(16),
            backgroundColor: theme.colors.primaryBackground,
        },
        button: {
            alignSelf: 'stretch',
            paddingHorizontal: 12,
            height: ACCOUNT_BUTTON_HEIGHT,
            maxHeight: ACCOUNT_BUTTON_HEIGHT,
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        separtor: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 0.75,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(theme.opacity.extra)
                .toString(),
        },
    };
}
