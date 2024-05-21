//@flow
import _ from 'lodash';
import Color from 'color';
import React from 'react';
import {Typography} from '../UIKit';
import {elevationStyle} from '../../themes';
import QRCode from 'react-native-qrcode-svg';
import FastImage from 'react-native-fast-image';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {MIN_SCREEN_SIZE} from '../../constants';

import i18n from '../../i18n';
import currency from '../../currency';

import DefaultOverlay from './defaultOverlay';

import FullLogoImageSource from '../../resources/images/img-full-logo.png';

export type Props = {
    overlaySource?: any,
    qrCodeData?: string,
    footer?: any,
    style?: any,
    color: string,
    amount: number,
    bonuses?: number,
    currency: string,
    subtitle?: string,
    textColor?: string,
    bonusColor?: string,
    onPress?: () => any,
    withBonuses?: boolean,
    withOutLogo?: boolean,
    amountFontSize?: number,
    onPressQrCode?: () => any,
};

const EMoneyCardComponent = ({
    style,
    color,
    amount,
    footer,
    bonuses,
    onPress,
    subtitle,
    textColor,
    bonusColor,
    qrCodeData,
    withBonuses,
    withOutLogo,
    onPressQrCode,
    overlaySource,
    amountFontSize,
    currency: code,
}: Props) => {
    const autoTextColor = textColor ? textColor : Color(color).isDark() ? '#fff' : '#252525';
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={!onPress}
            style={[
                styles.container,
                !withBonuses
                    ? {
                          aspectRatio: 2,
                      }
                    : undefined,
                style,
            ]}
            onPress={onPress}>
            {withBonuses ? (
                <View style={[styles.card, styles.bonusCard, {backgroundColor: bonusColor || '#C98D28'}]}>
                    {overlaySource ? (
                        <FastImage
                            style={[styles.overlay, StyleSheet.absoluteFill]}
                            resizeMode={FastImage.resizeMode.cover}
                            source={overlaySource}
                        />
                    ) : (
                        <DefaultOverlay
                            style={[styles.overlay, StyleSheet.absoluteFill]}
                            color={bonusColor || '#C98D28'}
                        />
                    )}
                    <Image
                        resizeMode="contain"
                        source={FullLogoImageSource}
                        style={[styles.logo, {tintColor: autoTextColor}]}
                    />
                    <Typography variant="body1" color={autoTextColor}>
                        {i18n.t('cards.bonus')}
                    </Typography>
                    <View style={{flex: 1}} />
                    {code.length > 0 ? (
                        <>
                            <Typography variant="body1" fontSize={12} color={autoTextColor}>
                                {i18n.t('cards.balance')}
                            </Typography>
                            <Typography
                                fontSize={18}
                                allowFontScaling
                                fontWeight="bold"
                                numberOfLines={1}
                                variant="subheading"
                                adjustsFontSizeToFit
                                color={autoTextColor}
                                minimumFontScale={0.5}
                                maxFontSizeMultiplier={1}>
                                {currency(bonuses || 0, code).format(true)}
                            </Typography>
                        </>
                    ) : null}
                </View>
            ) : null}
            <View style={[styles.card, {backgroundColor: color, width: withBonuses ? '70%' : '100%'}]}>
                {overlaySource ? (
                    <FastImage
                        style={[styles.overlay, StyleSheet.absoluteFill]}
                        resizeMode={FastImage.resizeMode.cover}
                        source={overlaySource}
                    />
                ) : (
                    <DefaultOverlay style={[styles.overlay, StyleSheet.absoluteFill]} color={color} />
                )}
                {!withOutLogo ? (
                    <Image
                        resizeMode="contain"
                        source={FullLogoImageSource}
                        style={[styles.logo, {tintColor: autoTextColor}]}
                    />
                ) : null}
                {subtitle && subtitle.length > 0 ? (
                    <Typography variant="body1" color={autoTextColor}>
                        {subtitle}
                    </Typography>
                ) : null}
                <View style={{flex: 1}} />
                {code.length > 0 ? (
                    <>
                        <Typography variant="body1" fontSize={12} color={autoTextColor}>
                            {i18n.t('cards.balance')}
                        </Typography>
                        <Typography
                            allowFontScaling
                            numberOfLines={1}
                            variant="display1"
                            adjustsFontSizeToFit
                            color={autoTextColor}
                            minimumFontScale={0.5}
                            maxFontSizeMultiplier={1}
                            fontSize={amountFontSize || 32}>
                            {currency(amount, code).format(true)}
                        </Typography>
                    </>
                ) : null}
                {_.isString(footer) ? (
                    <Typography variant="body1" color={autoTextColor} fontSize={12}>
                        {footer}
                    </Typography>
                ) : (
                    footer
                )}
                {qrCodeData ? (
                    <TouchableOpacity activeOpacity={0.8} style={styles.qrCode} onPress={onPressQrCode}>
                        <QRCode
                            size={MIN_SCREEN_SIZE * (withBonuses ? 0.125 : 0.16)}
                            backgroundColor="rgba(0,0,0,0)"
                            value={qrCodeData}
                            color={'#252525'}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 2.3,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    card: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        paddingTop: 16,
        paddingLeft: 16,
        borderRadius: 8,
        paddingRight: 10,
        paddingBottom: 8,
        position: 'absolute',
        backgroundColor: 'red',
        flexDirection: 'column',
        alignItems: 'flex-start',
        ...elevationStyle(8),
    },
    logo: {
        width: 80,
        height: 20,
        minWidth: 60,
        maxWidth: '100%',
        tintColor: '#fff',
    },
    bonusCard: {
        left: '64%',
        width: '36%',
        height: '90%',
        paddingLeft: 32,
        ...elevationStyle(6),
    },
    qrCode: {
        top: 12,
        right: 12,
        padding: 8,
        borderRadius: 8,
        position: 'absolute',
        backgroundColor: '#fff',
    },
    overlay: {
        borderRadius: 8,
    },
});

export default EMoneyCardComponent;
