import _ from 'lodash';
import Color from 'color';
import type {Theme} from '../../../themes';
import {fontStyles, textColorByTheme} from '../Typography/styles';

export default function(
    theme: Theme,
    {lineWidth, fontSize, disabledLineWidth, labelFontSize, activeLineWidth, textColor, tintColor, errorColor}: any,
): any {
    return {
        rest: {
            labelTextStyle: {
                ...fontStyles.regular,
            },
            titleTextStyle: {
                ...fontStyles.regular,
            },
            affixTextStyle: {
                ...fontStyles.regular,
            },
            style: {
                ...fontStyles.regular,
            },
            errorColor: errorColor ? textColorByTheme(theme, errorColor) : theme.colors.errorText,
            textColor: textColor ? textColorByTheme(theme, textColor) : theme.colors.primaryText,
            tintColor: tintColor ? textColorByTheme(theme, tintColor) : theme.colors.button,
            keyboardAppearance: theme.keyboardAppearance,
            disabledLineWidth: disabledLineWidth || 1,
            baseColor: theme.colors.secondaryText,
            activeLineWidth: activeLineWidth || 2,
            labelFontSize: labelFontSize || 12,
            lineWidth: lineWidth || 0.725,
            fontSize: fontSize || 16,
        },
    };
}
