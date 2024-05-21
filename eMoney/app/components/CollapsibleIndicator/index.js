// @flow
import React, {memo} from 'react';
import {themedRender, type Theme} from '../../themes';
import * as Animatable from 'react-native-animatable';
import {ActivityIndicator, View, Image} from 'react-native';

import getStyles from './styles';

import KeyboardArrowDownIconSource from '../../resources/icons/ic-keyboard-arrow-down.png';

export type Props = {
    loading?: ?boolean,
    style?: ?any,
    open?: ?boolean,
};

type InternalProps = Props & {
    theme: Theme,
    styles: any,
};

const CollapsibleIndicatorComponent = ({theme, styles, open, style, loading}: InternalProps) => {
    if (loading) {
        return (
            <View style={[styles.container, style]}>
                <ActivityIndicator size="small" color={theme.colors.button} animating />
            </View>
        );
    }
    return (
        <Animatable.View
            isInteraction
            duration={334}
            useNativeDriver
            style={[styles.container, style]}
            animation={
                open
                    ? {from: {rotate: '0deg'}, to: {rotate: '180deg'}}
                    : {from: {rotate: '180deg'}, to: {rotate: '0deg'}}
            }>
            <Image style={styles.icon} source={KeyboardArrowDownIconSource} />
        </Animatable.View>
    );
};

export default memo<Props>((props: Props) => themedRender(CollapsibleIndicatorComponent, props, getStyles));
