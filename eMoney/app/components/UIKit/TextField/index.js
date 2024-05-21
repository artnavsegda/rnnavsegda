// @flow
import React from 'react';
import {TextField as BaseTextField, FilledTextField, OutlinedTextField} from 'react-native-material-textfield';

import {themedRender, type Theme} from '../../../themes';

import getStyles from './styles';

export type Props = {
    disabledLineType?: 'solid' | 'dotted' | 'dashed',
    lineType?: 'solid' | 'dotted' | 'dashed',
    variant?: 'base' | 'filled' | 'outlined',
    onChangeText?: (text: string) => any,
    renderRightAccessory?: any,
    characterRestriction?: any,
    inputContainerStyle?: any,
    renderLeftAccessory?: any,
    animationDuration?: number,
    disabledLineWidth?: number,
    onChange?: (e: any) => any,
    activeLineWidth?: number,
    containerStyle?: any,
    labelFontSize?: number,
    onFocus?: () => any,
    onBlur?: () => any,
    inputProps?: any,
    formatText?: any,
    contentInset?: any,
    multiline?: boolean,
    labelOffset?: any,
    disabled?: boolean,
    editable?: boolean,
    lineWidth?: number,
    fontSize?: number,
    errorColor?: any,
    baseColor?: any,
    tintColor?: any,
    textColor?: any,
    label?: string,
    title?: string,
    value?: string,
    prefix?: string,
    suffix?: string,
    error?: string,
    style?: any,
};

type InnerProps = Props & {
    styles: any,
    theme: Theme,
};

function componentByVariant(variant?: string): any {
    switch (variant) {
        case 'filled':
            return FilledTextField;
        case 'outlined':
            return OutlinedTextField;
        default:
            return BaseTextField;
    }
}

const TextField = ({
    style,
    label,
    title,
    value,
    error,
    prefix,
    styles,
    suffix,
    onBlur,
    onFocus,
    variant,
    disabled,
    onChange,
    editable,
    multiline,
    formatText,
    inputProps,
    labelOffset,
    contentInset,
    onChangeText,
    containerStyle,
    animationDuration,
    inputContainerStyle,
    renderLeftAccessory,
    renderRightAccessory,
    characterRestriction,
}: InnerProps) => {
    const Component = componentByVariant(variant);
    return (
        <Component
            {...styles.rest}
            renderRightAccessory={renderRightAccessory}
            characterRestriction={characterRestriction}
            renderLeftAccessory={renderLeftAccessory}
            inputContainerStyle={inputContainerStyle}
            animationDuration={animationDuration}
            style={[styles.rest.style, style]}
            containerStyle={containerStyle}
            contentInset={contentInset}
            onChangeText={onChangeText}
            labelOffset={labelOffset}
            formatText={formatText}
            multiline={multiline}
            editable={editable}
            onChange={onChange}
            disabled={disabled}
            onFocus={onFocus}
            onBlur={onBlur}
            prefix={prefix}
            suffix={suffix}
            label={label}
            title={title}
            value={value}
            error={error}
            {...inputProps || {}}
        />
    );
};

TextField.defaultProps = {
    variant: 'base',
};

const ThemedTextField = (props: Props) => themedRender(TextField, props, getStyles);

export default ThemedTextField;
