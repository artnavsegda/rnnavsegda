// @flow
import React from 'react';
import {Text, Animated} from 'react-native';
import {themedRender} from '../../../themes';

import getStyles, {textColorByTheme, fontSpecsByVariant} from './styles';

export type Props = {
    style?: any,
    children?: any,
    lineHeight?: any,
    fontSize?: number,
    numberOfLines?: number,
    paragraph?: boolean | number,
    as?: Text | Animated.Text | any,
    align?: 'left' | 'center' | 'right' | 'justify',
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600',
    color?: 'primary' | 'secondary' | 'button' | 'button-caption' | 'link' | 'success' | 'error' | 'warning' | string,
    variant?:
        | 'display1'
        | 'display2'
        | 'display3'
        | 'display4'
        | 'headline'
        | 'title'
        | 'subheading'
        | 'body1'
        | 'body2'
        | 'caption'
        | 'button',
};

const Typography = ({
    as,
    style,
    color,
    align,
    styles,
    variant,
    fontSize,
    paragraph,
    fontWeight,
    lineHeight,
    ...props
}: any) => {
    const Component = as || Text;
    return <Component style={[styles.component, style]} {...props || {}} />;
};

Typography.defaultProps = {
    variant: 'body1',
    color: 'primary',
};

// Wrapped themed component
const ThemedTypography = (props: Props) => themedRender(Typography, props, getStyles);

ThemedTypography.textColorByTheme = textColorByTheme;
ThemedTypography.fontSpecsByVariant = fontSpecsByVariant;

export default ThemedTypography;
