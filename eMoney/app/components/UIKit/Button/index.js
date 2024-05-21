// @flow
import _ from 'lodash';
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {themedRender, type Theme} from '../../../themes';

import TouchableComponent from '../TouchableComponent';
import Typography from '../Typography';

import getStyles from './styles';

export type Props = {
    variant?: 'text' | 'link' | 'outlined' | 'contained' | 'uncontained' | 'action' | 'icon',
    hitSlop?: {left?: number, right?: number, top?: number, bottom?: number},
    alignContent?: 'center' | 'space-between',
    size?: 'small' | 'normal' | 'large',
    onLongPress?: ?() => any,
    onPress?: ?() => any,
    disabled?: ?boolean,
    loading?: ?boolean,
    tintColor?: any,
    accessory?: any,
    children?: any,
    style?: any,
};

type InternalProps = Props & {
    theme: Theme,
    styles: any,
};

// noinspection JSUnresolvedVariable
const Button = ({
    alignContent,
    tintColor,
    accessory,
    disabled,
    children,
    loading,
    variant,
    styles,
    style,
    theme,
    size,
    ...rest
}: InternalProps) => {
    const fontSize: number = styles.textSizes[size || 'normal'] || 16,
        textColor: string = tintColor || Typography.textColorByTheme(theme, styles.textColors[variant || 'contained']),
        accessoryColor: string = variant === 'action' ? theme.colors.primaryText : textColor;
    return (
        <TouchableComponent
            {...(rest || {})}
            styles={styles}
            disabled={disabled || loading || false}
            style={[
                styles.container,
                styles[variant || 'contained'][size || 'normal'],
                disabled ? {opacity: theme.opacity.extra} : undefined,
                alignContent ? {justifyContent: alignContent} : undefined,
                style,
            ]}
            variant={variant || 'contained'}>
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="small" color={styles.loaderColors[variant || 'contained']} />
                </View>
            ) : children ? (
                <>
                    {_.isString(children) ? (
                        <Typography
                            color={textColor}
                            fontSize={fontSize}
                            style={{opacity: disabled ? 0.72 : 1}}
                            variant={variant === 'outlined' ? 'button' : 'caption'}>
                            {children}
                        </Typography>
                    ) : _.isFunction(children) ? (
                        children(theme, textColor, fontSize)
                    ) : (
                        children
                    )}
                    {!accessory || disabled
                        ? null
                        : _.isFunction(accessory)
                        ? accessory(theme, accessoryColor, fontSize)
                        : React.cloneElement(React.Children.only(accessory), {theme, color: accessoryColor})}
                </>
            ) : null}
        </TouchableComponent>
    );
};

Button.defaultProps = {
    variant: 'contained',
    size: 'normal',
};

// Wrapped themed component
export default (props: Props) => themedRender(Button, props, getStyles);
