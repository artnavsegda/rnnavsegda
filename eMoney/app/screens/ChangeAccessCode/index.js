// @flow
import React from 'react';
import {connect} from 'react-redux';
import {type ReduxState} from '../../reducers';
import {ACCESS_CODE_INPUT_SIZE, type ClientInfo, FILLED_CODE} from '../../constants';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {doneByPromise, getMessage} from '../../utils';
import RNSimpleCrypto from 'react-native-simple-crypto';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Button, Containers, Typography} from '../../components';
import {Image, Keyboard, Switch, Alert, Platform, View, TextInput} from 'react-native';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    enableBiometrics: boolean,
    accessHash?: string,
    client?: ClientInfo,
    loading?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    enableBiometrics: boolean,
    biometryType: ?string,
    changeMode: boolean,
    loading: boolean,
    error: string,
    code: string,
};

class ChangeAccessCodeScreen extends React.Component<Props, State> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;
    constructor(props: Props, context: any) {
        super(props, context);
        const changeMode = (props.accessHash || '').length > 4;
        this.state = {
            enableBiometrics: props.enableBiometrics,
            code: changeMode ? FILLED_CODE : '',
            biometryType: undefined,
            changeMode: changeMode,
            loading: false,
            error: '',
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.navigationEventListener = Navigation.events().bindComponent(this);
        ReactNativeBiometrics.isSensorAvailable().then(
            ({biometryType}: any) => this.mounted && this.setState({biometryType}),
        );
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear() {}

    onPressClose = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            Keyboard.dismiss();
            if (!this.props.componentId) {
                this.props.onClose && this.props.onClose();
                return resolve();
            }
            const dismissFn = () => {
                Navigation.dismissModal(this.props.componentId).then(resolve).catch(reject);
            };
            if (this.bottomPanelRef) {
                // noinspection JSUnresolvedFunction
                return doneByPromise(this.bottomPanelRef.hide(), dismissFn);
            }
            dismissFn();
        });
    };

    onPressRemove = () => {
        doing.api.client.changeAccessHash(null, false);
        return this.onPressClose();
    };

    onPressConfirm = () => {
        if (this.state.code.length < ACCESS_CODE_INPUT_SIZE) {
            return;
        }
        Keyboard.dismiss();
        if (this.state.code === FILLED_CODE) {
            doing.api.client.changeAccessHash(FILLED_CODE, this.state.enableBiometrics && !!this.state.biometryType);
            return this.onPressClose();
        }
        this.setState({loading: true}, () => {
            RNSimpleCrypto.SHA.sha1(this.state.code)
                .then((hash: string) => {
                    const accessHash = RNSimpleCrypto.utils.convertArrayBufferToBase64(
                        RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(hash),
                    );
                    doing.api.client.changeAccessHash(
                        accessHash,
                        this.state.enableBiometrics && !!this.state.biometryType,
                    );
                    // noinspection JSIgnoredPromiseFromCall
                    this.onPressClose();
                })
                .catch((error: any) => {
                    Alert.alert('Ошибка', getMessage(error));
                    this.setState({loading: false});
                });
        });
    };

    onChangeEnableBiometrics = (value: boolean) => this.setState({enableBiometrics: value});

    onChangeCode = (text: string) => this.setState({code: text.trim()});

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    render() {
        const {styles, theme} = this.props;
        return (
            <Containers.BPS
                styles={styles.bps}
                useHardwareBackHandlers
                testID="accessCodeConfig"
                ref={this.onBottomPanelRef}
                onPressBackdrop={this.onPressClose}>
                <View style={styles.header}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="center">
                        {this.state.changeMode ? i18n.t('accessCode.changeTitle') : i18n.t('accessCode.title')}
                    </Typography>
                    <Animatable.View delay={250} duration={334} useNativeDriver animation="fadeInRight">
                        <Button variant="icon" style={styles.closeButton} onPress={this.onPressClose}>
                            <Image
                                resizeMode="contain"
                                style={styles.closeIcon}
                                source={require('../../resources/icons/ic-close.png')}
                            />
                        </Button>
                    </Animatable.View>
                </View>
                <View style={styles.content}>
                    <View style={styles.inputBlock}>
                        <TextInput
                            secureTextEntry
                            numberOfLines={1}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            value={this.state.code}
                            keyboardType="number-pad"
                            editable={!this.state.loading}
                            onChangeText={this.onChangeCode}
                            maxLength={ACCESS_CODE_INPUT_SIZE}
                            autoFocus={!this.state.changeMode}
                            keyboardAppearance={theme.keyboardAppearance}
                            placeholderTextColor={theme.colors.secondaryText}
                            clearTextOnFocus={this.state.code === FILLED_CODE}
                            placeholder={i18n.t('accessCode.codePlaceholder', {count: ACCESS_CODE_INPUT_SIZE})}
                        />
                    </View>
                    <Typography variant="body1" paragraph={16} color="secondary">
                        {i18n.t('accessCode.text')}
                    </Typography>
                    {this.state.biometryType || Platform.OS === 'ios' ? (
                        <View style={styles.row}>
                            <Typography
                                variant="body1"
                                paragraph={16}
                                style={{flex: 1, paddingRight: 16}}
                                color={this.state.biometryType ? 'primary' : 'secondary'}>
                                {i18n.t('accessCode.biometrics')}
                            </Typography>
                            <Switch
                                value={this.state.enableBiometrics}
                                onValueChange={this.onChangeEnableBiometrics}
                                disabled={!this.state.biometryType || this.state.loading}
                            />
                        </View>
                    ) : null}
                    <View style={styles.actions}>
                        {this.state.changeMode ? (
                            <Button
                                variant="link"
                                alignContent="center"
                                style={{minHeight: 44}}
                                onPress={this.onPressRemove}>
                                {i18n.t('accessCode.remove')}
                            </Button>
                        ) : null}
                        <Button
                            variant="contained"
                            alignContent="center"
                            loading={this.state.loading}
                            onPress={this.onPressConfirm}
                            disabled={this.state.code.length < ACCESS_CODE_INPUT_SIZE && this.state.error.length < 1}>
                            {i18n.t('accessCode.confirm')}
                        </Button>
                    </View>
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.ChangeAccessCode';
export function getNC(props: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(props || {}),
                skipThemingStatusBar: true,
            },
            options: {
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
                ...(options || {}),
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

export function show(props: any) {
    return Navigation.showModal(getNC(props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    client: state.client.info,
    accessHash: state.client.accessHash,
    enableBiometrics: state.client.enableBiometrics,
}))(withTheme(ChangeAccessCodeScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
