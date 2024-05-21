//@flow
import _ from 'lodash';
import Color from 'color';
import React, {memo, useEffect} from 'react';
import {View, Animated, BackHandler, Image, StyleSheet} from 'react-native';
import {MODAL_NAV_BAR_TOP_PADDING, STATUS_BAR_HEIGHT} from '../../constants';

import {Button, Typography} from '../UIKit';

import CloseIconSource from '../../resources/icons/ic-bold-close.png';
import BackIconSource from '../../resources/icons/ic-back.png';
import {themedRender} from '../../themes';
import type {Theme} from '../../themes';

export type Item = {
    icon?: any,
    view?: any,
    color?: any,
    text?: string,
    iconSource?: any,
    onPress?: () => any,
};

export type Props = {
    style?: any,
    title?: any,
    children?: any,
    tintColor?: any,
    componentId?: any,
    leftItems?: Item[],
    rightItems?: Item[],
    maxFillOpacity?: number,
    scrollY?: Animated.Value,
    onPressBack?: () => any,
    withFillAnimation?: boolean,
    useHardwareBackHandler?: boolean,
    withBottomBorder?: boolean | 'animated',
    translucentStatusBar?: boolean | 'adaptive',
    showBackButton?: boolean | 'text' | 'close' | 'close-text',
};

const itemRenderer = (prefix: string, tintColor?: any) => (item: Item, index: number) =>
    item.view ? (
        <View key={`${prefix}.${index}`} style={styles.item} onPress={item.onPress}>
            {item.view}
        </View>
    ) : (
        <Button
            style={styles.item}
            alignContent="center"
            onPress={item.onPress}
            key={`${prefix}.${index}`}
            tintColor={item.color || tintColor}
            variant={item.icon || item.iconSource ? 'icon' : 'text'}>
            {item.icon ? (
                item.icon
            ) : item.iconSource ? (
                <Image
                    resizeMode="contain"
                    source={item.iconSource}
                    style={[
                        styles.itemIcon,
                        tintColor ? {tintColor} : item.color ? {tintColor: item.color} : undefined,
                    ]}
                />
            ) : (
                item.text
            )}
        </Button>
    );

const getBackButtonContent = (variant: boolean | 'text' | 'close' | 'close-text', tintColor?: any): any => {
    switch (variant) {
        case 'text':
            return 'Назад';
        case 'close-text':
            return 'Закрыть';
        default:
            return (
                <Image
                    resizeMode="contain"
                    style={[styles.icon, tintColor ? {tintColor} : undefined]}
                    source={variant === 'close' ? CloseIconSource : BackIconSource}
                />
            );
    }
};

const renderBackButton = (variant: boolean | 'text' | 'close' | 'close-text', tintColor?: any, onPress?: () => any) => {
    if (!variant) {
        return false;
    }
    return (
        <Button
            onPress={onPress}
            style={styles.item}
            tintColor={tintColor}
            alignContent="center"
            hitSlop={{left: 4, top: 4, bottom: 4, right: 16}}
            pressRetentionOffset={{left: 4, top: 4, bottom: 4, right: 16}}
            variant={_.isBoolean(variant) || !(variant === 'text' || variant === 'close-text') ? 'icon' : 'text'}>
            {getBackButtonContent(variant, tintColor)}
        </Button>
    );
};

type InternalProps = Props & {
    theme: Theme,
};

const offset = 32 * 1.5;
const pathSize = Math.max(20, STATUS_BAR_HEIGHT);
const inputRange = [-(pathSize * 1.5), -pathSize, 0, pathSize];
const verticalOffset = offset * 0.25;
const containerOffsetScale = 2.5;
const scale = 0.8;

const NavBarComponent = ({
    style,
    title,
    theme,
    scrollY,
    children,
    leftItems,
    tintColor,
    rightItems,
    onPressBack,
    maxFillOpacity,
    showBackButton,
    withBottomBorder,
    withFillAnimation,
    translucentStatusBar,
    useHardwareBackHandler,
}: InternalProps) => {
    useEffect(() => {
        const backAction = () => {
            if (useHardwareBackHandler) {
                onPressBack && onPressBack();
            }
            return useHardwareBackHandler;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Animated.View
            style={[
                style,
                styles.container,
                {
                    transform: [
                        {
                            translateY: scrollY
                                ? scrollY.interpolate({
                                      inputRange,
                                      outputRange: [
                                          0,
                                          0,
                                          -verticalOffset * containerOffsetScale,
                                          -verticalOffset * containerOffsetScale,
                                      ],
                                  })
                                : 0,
                        },
                    ],
                },
                translucentStatusBar
                    ? {
                          paddingTop:
                              translucentStatusBar === 'adaptive' ? MODAL_NAV_BAR_TOP_PADDING : STATUS_BAR_HEIGHT,
                      }
                    : undefined,
            ]}>
            {withFillAnimation && maxFillOpacity ? (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            opacity: scrollY
                                ? scrollY.interpolate({
                                      inputRange,
                                      outputRange: [0, 0, maxFillOpacity, maxFillOpacity],
                                  })
                                : maxFillOpacity,
                            backgroundColor: theme.colors.secondaryBackground,
                        },
                    ]}
                />
            ) : null}
            <View style={styles.wrapper}>
                <Animated.View
                    style={[
                        styles.panel,
                        {
                            paddingLeft: showBackButton || (leftItems && leftItems.length > 0) ? 0 : 10,
                            paddingRight: rightItems && rightItems.length > 0 ? 0 : 10,
                            transform: [
                                {
                                    translateY: scrollY
                                        ? scrollY.interpolate({
                                              inputRange,
                                              outputRange: [
                                                  0,
                                                  0,
                                                  (verticalOffset * containerOffsetScale) / 2,
                                                  (verticalOffset * containerOffsetScale) / 2,
                                              ],
                                          })
                                        : 0,
                                },
                            ],
                        },
                    ]}>
                    {showBackButton || (leftItems && leftItems.length > 0) ? (
                        <View style={styles.items}>
                            {renderBackButton(
                                showBackButton || false,
                                tintColor || theme.colors.primaryText,
                                onPressBack,
                            )}
                            {(leftItems || []).map(itemRenderer('l', tintColor || theme.colors.primaryText))}
                        </View>
                    ) : null}
                    <View style={styles.title}>
                        {_.isString(title) ? (
                            <Typography
                                align="left"
                                fontSize={32}
                                lineHeight={32}
                                fontWeight="400"
                                variant="display2"
                                numberOfLines={1}
                                as={Animated.Text}
                                style={{
                                    width: '100%',
                                    transform: [
                                        {
                                            scale: scrollY
                                                ? scrollY.interpolate({
                                                      inputRange,
                                                      outputRange: [1, 1, scale, scale],
                                                  })
                                                : 1,
                                        },
                                        {
                                            translateX: scrollY
                                                ? scrollY.interpolate({
                                                      inputRange,
                                                      outputRange: [0, 0, -offset, -offset],
                                                  })
                                                : 0,
                                        },
                                    ],
                                }}
                                color={tintColor || 'primary'}>
                                {title}
                            </Typography>
                        ) : (
                            title
                        )}
                    </View>
                    {rightItems && rightItems.length > 0 ? (
                        <View style={styles.items}>
                            {rightItems.map(itemRenderer('r', tintColor || theme.colors.primaryText))}
                        </View>
                    ) : null}
                </Animated.View>
            </View>
            {children}
            {withBottomBorder ? (
                <Animated.View
                    style={[
                        styles.bottomBorder,
                        {
                            backgroundColor: Color(theme.colors.navigationBorder).alpha(theme.opacity.spoon).toString(),
                            opacity:
                                withBottomBorder === 'animated'
                                    ? scrollY
                                        ? scrollY.interpolate({
                                              inputRange,
                                              outputRange: [0, 0, 1, 1],
                                          })
                                        : 0
                                    : 1,
                        },
                    ]}
                />
            ) : null}
        </Animated.View>
    );
};

NavBarComponent.defaultProps = {
    maxFillOpacity: 0.9,
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flexDirection: 'column',
    },
    wrapper: {
        minHeight: 72,
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    panel: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    items: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        height: 48,
        minWidth: 36,
        alignItems: 'center',
        paddingHorizontal: 4,
        justifyContent: 'center',
    },
    title: {flex: 1, paddingTop: 4},
    icon: {
        width: 16,
        height: 16,
        tintColor: '#252525',
    },
    itemIcon: {
        width: 24,
        height: 24,
        tintColor: '#252525',
    },
    bottomBorder: {
        left: 0,
        right: 0,
        bottom: 0,
        height: 0.85,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
});

export default memo<Props>((props: Props) => themedRender(NavBarComponent, props));
