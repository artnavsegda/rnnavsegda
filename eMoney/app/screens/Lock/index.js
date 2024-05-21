// @flow
import React from 'react';
import {connect} from 'react-redux';
import {InteractionManager} from 'react-native';
import type {ReduxState} from '../../reducers';
import {Navigation} from 'react-native-navigation';
import LogIn from '../LogIn';
import * as Animatable from 'react-native-animatable';
import RNSimpleCrypto from 'react-native-simple-crypto';
import ReactNativeBiometrics from 'react-native-biometrics';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {View, ActivityIndicator, Image as RNImage, TouchableOpacity, Alert} from 'react-native';
import {ACCESS_CODE_INPUT_SIZE} from '../../constants';
import {withTheme, type Theme} from '../../themes';
import {Image, Typography} from '../../components';
import {getNC as getMainTabsNC} from '../Tabs';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    enableBiometrics: boolean,
    accessHash: string,
    componentId: any,
    theme: Theme,
    client: any,
    styles: any,
};

type State = {
    availableBiometrics: boolean,
    animation: ?string,
    loading: boolean,
    success: boolean,
    code: string,
};

class LockScreen extends React.PureComponent<Props, State> {
    navigationEventListener: any = null;
    state: State = {
        code: '',
        success: false,
        loading: false,
        animation: null,
        availableBiometrics: false,
    };

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
        ReactNativeBiometrics.isSensorAvailable().then(({available}) =>
            this.setState({availableBiometrics: available}),
        );
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear() {
        this.simplePromptBiometrics();
    }

    onPressLogout = () => {
        Alert.alert(i18n.t('commons.information'), i18n.t('accessCode.quitQuestion'), [
            {
                text: i18n.t('commons.yes'),
                style: 'default',
                onPress: () => {
                    this.setState({loading: true}, () => {
                        doing.api.client
                            .logoffRequest()
                            .after(() => this.success(true))
                            .start();
                    });
                },
            },
            {
                text: i18n.t('commons.no'),
                style: 'cancel',
            },
        ]);
    };

    onPressBackspace = () => {
        if (this.state.loading || this.state.code.length < 1) {
            return;
        }
        this.setState({
            code: this.state.code.slice(0, -1) || '',
            animation: null,
        });
    };

    simplePromptBiometrics = () => {
        this.props.enableBiometrics &&
            ReactNativeBiometrics.isSensorAvailable().then(({available}) => {
                if (!available) {
                    return;
                }
                this.setState({loading: true}, () => {
                    ReactNativeBiometrics.simplePrompt({
                        promptMessage: 'Подтвердите вход',
                    })
                        .then((resultObject) => {
                            const {success} = resultObject;
                            if (success) {
                                this.success();
                                return;
                            }
                            return Promise.reject(new Error('InvalidBiometrics'));
                        })
                        .catch(() => this.setState({loading: false}));
                });
            });
    };

    success = (isLogOut = false) => {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
        this.setState({success: true}, () => {
            Navigation.setStackRoot(this.props.componentId, getMainTabsNC(this.props.theme));
            if (isLogOut) {
                InteractionManager.runAfterInteractions(() => {
                    LogIn.show();
                });
            }
        });
    };

    checkCode = () => {
        if (this.state.code.length < ACCESS_CODE_INPUT_SIZE) {
            return;
        }
        this.setState({loading: true}, () => {
            RNSimpleCrypto.SHA.sha1(this.state.code)
                .then((hash: string) => {
                    const accessHash = RNSimpleCrypto.utils.convertArrayBufferToBase64(
                        RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(hash),
                    );
                    if (this.props.accessHash === accessHash) {
                        this.success();
                        return;
                    }
                    return Promise.reject(new Error('InvalidCode'));
                })
                .catch(() => {
                    setTimeout(() => {
                        ReactNativeHapticFeedback.trigger('notificationError');
                        this.setState({code: '', animation: 'shake', loading: false});
                    }, 600);
                });
        });
    };

    pushNumberToCode = (n: number) => {
        if (this.state.loading || this.state.code.length > ACCESS_CODE_INPUT_SIZE - 1) {
            return;
        }
        ReactNativeHapticFeedback.trigger('selection');
        this.setState(
            {
                code: `${this.state.code}${n}`.trim(),
                animation: null,
            },
            this.checkCode,
        );
    };

    renderButton = (key: string, content: any, onPress: () => any) => (
        <TouchableOpacity
            key={key}
            onPress={onPress}
            activeOpacity={0.62}
            disabled={this.state.loading}
            style={this.props.styles.button}>
            {typeof content === 'string' ? (
                <Typography color="button-caption" variant={'display2'} fontWeight="300">
                    {content}
                </Typography>
            ) : (
                content
            )}
        </TouchableOpacity>
    );

    renderNumberButton = (n: number) => this.renderButton(`n.${n}`, `${n}`, () => this.pushNumberToCode(n));

    render() {
        const {styles, theme, client} = this.props;
        const codeLength = this.state.loading ? ACCESS_CODE_INPUT_SIZE : this.state.code.length;
        return (
            <View testID="lock" style={styles.container}>
                <View style={styles.block}>
                    {(client.clientGuid || '').length > 4 ? (
                        <View style={styles.clientInfo}>
                            <Image
                                resizeMode="cover"
                                style={styles.avatar}
                                source={doing.api.files.sourceBy(client)}
                                defaultSource={require('../../resources/images/img-empty-avatar.png')}
                            />
                            <Typography variant="title" color="button-caption" fontWeight="normal">
                                {client.name || i18n.t('settings.emptyName')}
                            </Typography>
                        </View>
                    ) : null}
                    <Animatable.View
                        useNativeDriver
                        style={styles.inputBlock}
                        duration={this.state.animation ? 800 : 400}
                        animation={this.state.success ? 'fadeOut' : this.state.animation}>
                        {[...Array(ACCESS_CODE_INPUT_SIZE)].map((v, index) => (
                            <Animatable.View
                                duration={334}
                                useNativeDriver
                                key={`i.${index}`}
                                style={styles.bullet(index, codeLength)}
                                animation={codeLength > index ? 'bounce' : null}
                            />
                        ))}
                    </Animatable.View>
                    <ActivityIndicator
                        size="small"
                        hidesWhenStopped
                        color={theme.colors.buttonText}
                        animating={this.state.loading && !this.state.success}
                    />
                </View>
                <Animatable.View
                    duration={400}
                    useNativeDriver
                    style={[styles.block, {flex: 0.7}]}
                    animation={this.state.success ? 'fadeOutDown' : 'fadeInUp'}>
                    <View style={styles.row}>
                        {this.renderNumberButton(1)}
                        {this.renderNumberButton(2)}
                        {this.renderNumberButton(3)}
                    </View>
                    <View style={styles.row}>
                        {this.renderNumberButton(4)}
                        {this.renderNumberButton(5)}
                        {this.renderNumberButton(6)}
                    </View>
                    <View style={styles.row}>
                        {this.renderNumberButton(7)}
                        {this.renderNumberButton(8)}
                        {this.renderNumberButton(9)}
                    </View>
                    <View style={styles.row}>
                        {this.renderButton(
                            'logout',
                            <RNImage
                                resizeMode="contain"
                                style={[styles.icon, {marginBottom: 4}]}
                                source={require('../../resources/icons/ic-logout.png')}
                            />,
                            this.onPressLogout,
                        )}
                        {this.renderNumberButton(0)}
                        {this.state.loading ||
                        ((!this.state.availableBiometrics || !this.props.enableBiometrics) && codeLength < 1) ? (
                            <View style={styles.button} />
                        ) : codeLength > 0 ? (
                            this.renderButton(
                                'backspace',
                                <RNImage
                                    resizeMode="contain"
                                    source={require('../../resources/icons/ic-backspace.png')}
                                    style={[styles.icon, {width: 32, height: 32, marginBottom: 4}]}
                                />,
                                this.onPressBackspace,
                            )
                        ) : (
                            this.renderButton(
                                'biometrics',
                                <RNImage
                                    resizeMode="contain"
                                    style={[styles.icon, {marginBottom: 4}]}
                                    source={require('../../resources/icons/ic-fingerprint-scan.png')}
                                />,
                                this.simplePromptBiometrics,
                            )
                        )}
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

export const navigationName = 'app.Lock';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
            },
            options: {
                topBar: {
                    visible: false,
                },
                statusBar: {
                    visible: true,
                    style: 'light',
                    drawBehind: true,
                    backgroundColor: 'transparent',
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    enableBiometrics: state.client.enableBiometrics,
    accessHash: state.client.accessHash,
    client: state.client.info || {},
}))(withTheme(LockScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = true;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
