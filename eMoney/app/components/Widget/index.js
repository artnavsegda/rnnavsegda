// @flow
import _ from 'lodash';
import Image from '../Image';
import React, {memo} from 'react';
import {Typography} from '../UIKit';
import {View, StyleSheet, Platform} from 'react-native';
import {elevationStyle, themedRender, type Theme} from '../../themes';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

export type Props = {
    variant?: 'icon' | 'image' | 'only-image' | 'service',
    size?: 'small' | 'large' | number, // small is default
    imageHorizontalInset?: number,
    backgroundColor?: any,
    source?: string | any,
    onPress?: () => any,
    fontSize?: number,
    caption?: string,
    color?: any,
    style?: any,
};

type InternalProps = Props & {
    theme: Theme,
    badge: Boolean,
};

const Icon = memo<Props>(({size, color, source}: any) => (
    <Image
        style={{
            width: size,
            height: size,
            borderRadius: 4,
        }}
        resizeMode="contain"
        tintColor={color}
        source={source}
        svgProps={{
            color,
            width: size,
            height: size,
            override: {
                height: size,
                width: size,
                color,
            },
        }}
        fallback={_.isNumber(source)}
    />
));

const Widget = ({
    style,
    size,
    color,
    theme,
    source,
    caption,
    variant,
    onPress,
    fontSize,
    backgroundColor,
    imageHorizontalInset,
    badge,
}: InternalProps) => {
    const _s: number = typeof size === 'number' ? size : size !== 'small' ? 90 : 46;
    const _ms: number = (variant === 'service' ? 36 : _s) - (imageHorizontalInset || 0);
    const _mix: any = {
        width: _ms,
        height: _ms,
        borderRadius: Math.max(8, 7 + (_ms / 82) * 9),
        ...(backgroundColor ? {backgroundColor} : {}),
    };
    return (
        <TouchableBounce
            onPress={onPress}
            disabled={!onPress}
            style={variant === 'service' ? styles.shadow : undefined}>
            {badge && <View style={styles.badgeContainer} />}
            <View
                style={[
                    style,
                    styles.container,
                    {
                        minHeight: _s,
                        width: _s <= 64 ? _s + 4 : _s,
                        justifyContent: caption && caption.length > 0 ? 'flex-start' : 'center',
                    },
                    ...(variant === 'service'
                        ? [styles.service, {backgroundColor: theme.colors.secondaryBackground}]
                        : []),
                ]}>
                {variant === 'only-image' ? (
                    source ? (
                        <Image style={[styles.image, _mix]} resizeMode="cover" source={source} />
                    ) : (
                        <View style={[styles.image, _mix]} />
                    )
                ) : (
                    <View style={[styles.image, _mix]}>
                        {source ? (
                            <Icon size={_ms * 0.6} color={variant !== 'image' ? color : undefined} source={source} />
                        ) : null}
                    </View>
                )}
                {caption && caption.length > 0 ? (
                    <Typography
                        align={variant === 'service' ? 'left' : 'center'}
                        fontSize={fontSize || 10}
                        style={styles.caption}
                        variant="body1"
                        color="primary">
                        {caption}
                    </Typography>
                ) : null}
            </View>
        </TouchableBounce>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 64,
        minHeight: 52,
        overflow: 'visible',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    service: {
        padding: 8,
        borderRadius: 16,
        //   overflow: 'visible',
        alignItems: 'flex-start',
    },
    shadow: {
        overflow: 'visible',
        borderRadius: 16,
        ...elevationStyle(Platform.select({ios: 14, android: 10}), 'rgba(0,0,0,.13)'),
    },
    caption: {
        marginTop: 6,
    },
    image: {
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        //backgroundColor: 'rgba(0,0,0,0.1)',
    },
    badgeContainer: {
        position: 'absolute',
        top: -2,
        right: 10,
        zIndex: 200,
        backgroundColor: '#ff3467',
        width: 8,
        height: 8,
        borderRadius: 8,
    },
});

export default (props: Props) => themedRender(Widget, props);
