// @flow
import _ from 'lodash';
import type {Theme} from '../../../themes';

// noinspection SpellCheckingInspection
export const fontStyles = {
    bold: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontFamily: 'Geometria-Bold',
    },
    medium: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontFamily: 'Geometria-Medium',
    },
    light: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontFamily: 'Geometria-Light',
    },
    regular: {
        textAlignVertical: 'center',
        includeFontPadding: false,
        fontFamily: 'Geometria',
    },
};

export function textColorByTheme(theme: Theme, color: any) {
    if (_.isObject(color)) {
        return color;
    }
    switch (color) {
        case 'primary':
            return theme.colors.primaryText;
        case 'secondary':
            return theme.colors.secondaryText;
        case 'button-caption':
            return theme.colors.buttonText;
        case 'button':
            return theme.colors.button;
        case 'link':
            return theme.colors.link;
        case 'success':
            return theme.colors.successText;
        case 'error':
            return theme.colors.errorText;
        case 'warning':
            return theme.colors.warningText;
        default:
            if (
                color &&
                color.length > 0 &&
                (color[0] === '#' || (color[0] === 'r' && color[color.length - 1] === ')'))
            ) {
                return color;
            }
            return theme.colors.primaryText;
    }
}

export function fontSpecsByVariant(variant: string): any {
    switch (variant) {
        case 'body2':
            return {
                ...fontStyles.medium,
                lineHeight: 20,
                fontSize: 14,
            };
        case 'display1':
            return {
                ...fontStyles.bold,
                lineHeight: 34,
                fontSize: 34,
            };
        case 'display2':
            return {
                lineHeight: 45,
                fontSize: 45,
            };
        case 'display3':
            return {
                lineHeight: 56,
                fontSize: 56,
            };
        case 'display4':
            return {
                ...fontStyles.light,
                lineHeight: 112,
                fontSize: 112,
            };
        case 'button':
            return {
                ...fontStyles.medium,
                lineHeight: 20,
                fontSize: 14,
            };
        case 'caption':
            return {
                lineHeight: 16,
                fontSize: 12,
            };
        case 'title':
            return {
                ...fontStyles.bold,
                lineHeight: 24,
                fontSize: 18,
            };
        case 'subheading':
            return {
                lineHeight: 24,
                fontSize: 18,
            };
        case 'headline':
            return {
                ...fontStyles.bold,
                lineHeight: 24,
                fontSize: 24,
            };
        default:
            return {
                lineHeight: 18,
                fontSize: 14,
            };
    }
}

export default function(theme: Theme, {variant, paragraph, color, align, fontSize, fontWeight, lineHeight}: any): any {
    return {
        component: {
            ...fontStyles.regular,
            ..._.merge(
                fontSpecsByVariant(variant),
                ...[
                    fontSize ? {fontSize, lineHeight: Math.ceil(fontSize * 1.075)} : {},
                    paragraph ? {marginBottom: _.isBoolean(paragraph) ? 12 : paragraph} : {},
                    lineHeight ? {lineHeight} : {},
                    fontWeight ? {fontWeight} : {},
                ],
            ),
            color: color ? textColorByTheme(theme, color) : theme.colors.primaryText,
            backgroundColor: 'transparent',
            textAlign: align || 'left',
        },
    };
}
