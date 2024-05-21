// @flow
import React from 'react';
import {connect} from 'react-redux';
import {isValidNumber} from 'libphonenumber-js';
import {Navigation} from 'react-native-navigation';
import {withTheme, type Theme} from '../../themes';
import * as Animatable from 'react-native-animatable';
import {TextInputMask} from 'react-native-masked-text';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {doneByPromise, getMessage, reformatPhoneNumber} from '../../utils';
import {Typography, Button, Timer, Accessory, Containers} from '../../components';
import {Keyboard, Platform, Image, Text, TextInput, InteractionManager, Linking, Alert, View} from 'react-native';

import ChangeAccessCode from '../ChangeAccessCode';

import {
    API_CLIENT_CONFIRM_LOGIN,
    API_CLIENT_REPEAT_SMS_CODE,
    API_CLIENT_REQUEST_LOGIN,
    PHONE_MASK_RU, PHONE_MASK_KZ
} from '../../constants';

import i18n from '../../i18n';
import doing from '../../doing';
import Request from '../../doing/request';

import getStyles from './styles';

import CloseIconSource from '../../resources/icons/ic-close.png';
import FullLogoImageSource from '../../resources/images/img-full-logo.png';

export type Props = {
    initPhoneNumber?: number,
    privacyPolicy?: string,
    lockClose?: boolean,
    onClose?: () => any,
    componentId: any,
    request?: Request,
    loading: boolean,
    smsTimer: number,
    title?: string,
    theme: Theme,
    styles: any,
};

type State = {
    validPhone: boolean,
    timestamp: number,
    phone: string,
    code: string,
    step: number, // 0 - phone, 1 - auth code, 2 - auth code, 3 - password
};

class LogInScreen extends React.Component<Props, State> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            timestamp: Math.floor(new Date() / 1000),
            phone: props.initPhoneNumber ? '+${props.initPhoneNumber}' : '',
            step: props.initPhoneNumber ? 1 : 0, // 0 - ввод телефона, > 0 - ввод кода из SMS
            validPhone: !!props.initPhoneNumber,
            code: '',
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear() {}

    onError = (err: any) => Alert.alert('Ошибка!', getMessage(err));

    onPressClose = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            Keyboard.dismiss();
            if (!this.props.componentId) {
                this.props.onClose && this.props.onClose();
                return resolve();
            }
            const dismissFn = () => {
                Navigation.dismissModal(this.props.componentId)
                    .then(() => {
                        this.props.onClose && this.props.onClose();
                        resolve();
                    })
                    .catch(reject);
            };
            if (this.bottomPanelRef) {
                // noinspection JSUnresolvedFunction
                return doneByPromise(this.bottomPanelRef.hide(), dismissFn);
            }
            dismissFn();
        });
    };

    onPressUserAgreements = () => {
        if (!this.props.privacyPolicy) {
            return;
        }
        const url = this.props.privacyPolicy || '';
        Linking.canOpenURL(url)
            .then(() => Linking.openURL(url))
            .catch((error: any) => Alert.alert('Ошибка!', getMessage(error)));
    };

    onPressNext = () => {
        if (this.props.loading || !this.state.validPhone) {
            return;
        }
        if (this.state.step <= 0) {
            const phone = parseInt(this.state.phone.replace(/\D/g, ''), 10) || 0;
            if (!phone) {
                return;
            }
            return doing.api.client
                .loginRequest(phone, (step: number) => {
                    this.mounted && this.setState({step: step + 1, timestamp: Math.floor(new Date() / 1000)});
                })
                .error(this.onError)
                .start();
        }
        if (this.state.step > 0) {
            if (this.state.code.length < 1) {
                return;
            }
            return doing.api.client
                .confirmLoginRequest(this.state.step - 1, this.state.code)
                .success(() => {
                    if (this.props.request) {
                        this.props.request.start();
                    }
                    return this.onPressClose().then(() => {
                        InteractionManager.runAfterInteractions(() => {
                            ChangeAccessCode.show().catch((error: any) => console.warn(getMessage(error)));
                        });
                    });
                })
                .error(this.onError)
                .start();
        }
    };

    onPressRepeatSms = () => {
        this.mounted &&
            this.setState({code: '', timestamp: Math.floor(new Date() / 1000)}, () => {
                doing.api.client
                    .repeatSmsCodeRequest()
                    .success(() => this.mounted && this.setState({timestamp: Math.floor(new Date() / 1000)}))
                    .error(this.onError)
                    .start();
            });
    };

    onChangePhone = (text: string) =>
        this.setState({
            phone: text.trim(),
            validPhone: isValidNumber(text.trim()),
        });

    onChangeCode = (text: string) => this.setState({code: text});

    onPressPasswordForgot = () =>
        doing.api.client
            .forgotPasswordRequest()
            .before(() => this.setState({step: 2, timestamp: Math.floor(new Date() / 1000)}))
            .start();

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    renderNextButton = () => {
        if (this.state.step <= 0 || this.state.step === 3 || (this.state.step > 0 && this.state.code.length > 4)) {
            return (
                <Button
                    variant="contained"
                    onPress={this.onPressNext}
                    alignContent="space-between"
                    loading={this.props.loading}
                    accessory={<Accessory size={14} variant="button" />}
                    disabled={this.state.step === 3 ? this.state.code.length < 8 : !this.state.validPhone}>
                    {i18n.t('login.next')}
                </Button>
            );
        }
        return (
            <Timer duration={this.props.smsTimer} from={this.state.timestamp}>
                {(left: number) => (
                    <Button
                        disabled={left > 0}
                        alignContent="center"
                        loading={this.props.loading}
                        onPress={this.onPressRepeatSms}
                        variant={left < 1 ? 'contained' : 'outlined'}>
                        {left > 0 ? i18n.t('login.repeatSmsAfterTime', {time: left}) : i18n.t('login.repeatSms')}
                    </Button>
                )}
            </Timer>
        );
    };

    renderContent = (styles: any, theme: Theme) => {
        const {phone, code, step} = this.state;
        return (
            <>
                <View style={styles.inputHeader}>
                    <Typography variant="body1" color="secondary" numberOfLines={1}>
                        {i18n.t(`login.inputHeader.title${step > 0 ? step : ''}`)}
                    </Typography>
                    {step === 3 ? (
                        <Button variant="link" onPress={this.onPressPasswordForgot}>
                            <Typography variant="body1" color="button" numberOfLines={1}>
                                Забыл пароль
                            </Typography>
                        </Button>
                    ) : null}
                </View>
                <View style={styles.inputBlock}>
                    {step > 0 ? (
                        <TextInput
                            value={code}
                            autoFocus={true}
                            numberOfLines={1}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            secureTextEntry={step > 0}
                            onChangeText={this.onChangeCode}
                            keyboardAppearance={theme.keyboardAppearance}
                            keyboardType={step > 2 ? 'default' : 'number-pad'}
                            placeholderTextColor={theme.colors.secondaryText}
                            textContentType={step < 3 ? 'oneTimeCode' : undefined}
                        />
                    ) : (
                        <TextInputMask
                            type="custom"
                            options={
                                phone.length < 17 ? { mask: PHONE_MASK_RU } : { mask: PHONE_MASK_KZ }}
                            autoFocus={true}
                            numberOfLines={1}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            keyboardType="phone-pad"
                            textContentType="telephoneNumber"
                            onChangeText={this.onChangePhone}
                            keyboardAppearance={theme.keyboardAppearance}
                            placeholderTextColor={theme.colors.secondaryText}
                            value={reformatPhoneNumber(`${phone}`, true)}
                        />
                    )}
                </View>
                {this.renderNextButton()}
                {step <= 0 ? (
                    <Typography variant="body1" style={{marginTop: 12}} color="secondary">
                        {i18n.t('login.confirmInfo')}{' '}
                        <Text
                            accessible
                            suppressHighlighting
                            style={styles.inlineLink}
                            onPress={this.onPressUserAgreements}>
                            {i18n.t('login.userAgreement')}
                        </Text>
                    </Typography>
                ) : (
                    <View style={{marginTop: 12, heihgt: 36}} />
                )}
            </>
        );
    };

    render() {
        const {styles, theme, title, lockClose} = this.props;
        return (
            <Containers.BPS
                testID="log-in"
                styles={styles.bps}
                useHardwareBackHandler
                ref={this.onBottomPanelRef}
                onPressBackdrop={!lockClose ? this.onPressClose : undefined}>
                <View style={[styles.header, lockClose ? styles.fullHeader : undefined]}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="center">
                        {title || i18n.t('login.title')}
                    </Typography>
                    {!lockClose ? (
                        <Animatable.View delay={250} duration={334} useNativeDriver animation="fadeInRight">
                            <Button variant="icon" style={styles.closeButton} onPress={this.onPressClose}>
                                <Image style={styles.closeIcon} resizeMode="contain" source={CloseIconSource} />
                            </Button>
                        </Animatable.View>
                    ) : null}
                </View>
                <View style={styles.content}>
                    <View style={styles.logoBlock}>
                        <Image style={styles.logo} resizeMode="contain" source={FullLogoImageSource} />
                    </View>
                    {this.renderContent(styles, theme)}
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.LogIn';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                skipThemingStatusBar: true,
            },
            options: {
                ...(options || {}),
                topBar: {
                    visible: false,
                },
                layout: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    componentBackgroundColor: 'rgba(0,0,0,0)',
                },
                modalPresentationStyle: Platform.select({ios: 'overFullScreen', android: 'overCurrentContext'}),
                statusBar: {
                    visible: true,
                    style: 'light',
                    drawBehind: true,
                    backgroundColor: 'transparent',
                },
                animations: {
                    ...((options || {}).animations || {}),
                    showModal: {
                        enabled: 'false',
                        waitForRender: true,
                    },
                    dismissModal: {
                        enabled: 'false',
                    },
                },
            },
        },
    };
}

export function show(props: any = {}) {
    return Navigation.showModal(getNC(props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    privacyPolicy: (state.auth.info || {}).privacyPolicy,
    smsTimer: (state.auth.info || {}).smsTimer || 30,
    loading: ReduxUtils.hasFetching(state, [
        API_CLIENT_REQUEST_LOGIN,
        API_CLIENT_CONFIRM_LOGIN,
        API_CLIENT_REPEAT_SMS_CODE,
    ]),
}))(withTheme(LogInScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
