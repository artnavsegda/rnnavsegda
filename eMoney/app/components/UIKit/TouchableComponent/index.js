//@flow
import React from 'react';
import {Platform, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';

import {exportBorderRadiusStyle} from '../../../utils';

const TouchableComponent = ({variant, styles, style, children, ...props}: any) => {
    if (Platform.OS === 'android') {
        // noinspection JSUnresolvedVariable
        return (
            <TouchableNativeFeedback
                {...props || {}}
                style={exportBorderRadiusStyle(style)}
                useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                background={
                    Platform.Version >= 21
                        ? TouchableNativeFeedback.Ripple(
                              variant && styles && (styles.rippleColors || styles.underlayColors)
                                  ? (styles.rippleColors || {})[variant] || (styles.underlayColors || {})[variant]
                                  : 'rgba(0,0,0,0.2)',
                              false,
                          )
                        : TouchableNativeFeedback.SelectableBackground()
                }>
                <View style={style}>{children}</View>
            </TouchableNativeFeedback>
        );
    }
    if (!variant || (variant === 'text' || variant === 'link' || variant === 'icon')) {
        return (
            <TouchableOpacity {...props || {}} activeOpacity={0.8} style={style}>
                {children}
            </TouchableOpacity>
        );
    }
    // noinspection JSUnresolvedVariable
    return (
        <TouchableHighlight
            {...props || {}}
            activeOpacity={0.65}
            style={exportBorderRadiusStyle(style)}
            underlayColor={
                variant && styles && styles.underlayColors ? styles.underlayColors[variant] : 'rgba(0,0,0,0.5)'
            }>
            <View style={style}>{children}</View>
        </TouchableHighlight>
    );
};

export default TouchableComponent;
