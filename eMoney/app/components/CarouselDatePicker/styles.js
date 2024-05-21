// @flow
import {elevationStyle, type Theme} from '../../themes';
import Color from 'color';

export default function(theme: Theme): any {
    return {
        selectBlock: {
            top: 4,
            bottom: 12,
            borderRadius: 16,
            position: 'absolute',
            backgroundColor: theme.colors.button,
        },
        separatorBlock: {
            height: 1,
            maxHeight: 1,
            flexDirection: 'row',
        },
        separator: {
            flex: 1,
            height: 1,
            borderRadius: 0.5,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
        },
        centerSeparator: {
            height: 1,
            width: 90,
            borderRadius: 0.5,
            backgroundColor: Color(theme.colors.buttonText)
                .alpha(0.6)
                .toString(),
        },
    };
}
