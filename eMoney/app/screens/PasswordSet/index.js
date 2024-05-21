// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import type {ReduxState} from '../../reducers';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import {doneByPromise, getMessage} from '../../utils';
import * as Animatable from 'react-native-animatable';
import {Button, Containers, Typography} from '../../components';
import {Alert, Image, Keyboard, Platform, TextInput, View} from 'react-native';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

import CloseIconSource from '../../resources/icons/ic-close.png';

export type Props = {
    onClose?: ?() => any,
    componentId: any,
    styles: any,
    theme: Theme,
};

type State = {
    passwordToo: string,
    password: string,
    loading: boolean,
};

class PasswordSetScreen extends React.PureComponent<Props, State> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;
    state: State = {
        passwordToo: '',
        password: '',
        loading: false,
    };

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

    onPressConfirm = () => {
        Keyboard.dismiss();
        this.setState({loading: true}, () => {
            doing.api.client
                .setPasswordRequest(this.state.password)
                .success(this.onPressClose)
                .error((error: any) => {
                    Alert.alert('Ошибка', getMessage(error));
                    this.setState({loading: false});
                })
                .start();
        });
    };

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

    onChangePasswordToo = (text: string) => this.setState({passwordToo: text});

    onChangePassword = (text: string) => this.setState({password: text});

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    render() {
        const {styles, theme} = this.props;
        return (
            <Containers.BPS
                styles={styles.bps}
                testID="password-set"
                useHardwareBackHandler
                ref={this.onBottomPanelRef}>
                <View style={styles.header}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="center">
                        {i18n.t('passwordSet.title')}
                    </Typography>
                    <Animatable.View delay={250} duration={334} useNativeDriver animation="fadeInRight">
                        <Button variant="icon" style={styles.closeButton} onPress={this.onPressClose}>
                            <Image style={styles.closeIcon} resizeMode="contain" source={CloseIconSource} />
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
                            keyboardType="default"
                            autoCompleteType="off"
                            value={this.state.password}
                            placeholder="Введите пароль"
                            editable={!this.state.loading}
                            onChangeText={this.onChangePassword}
                            keyboardAppearance={theme.keyboardAppearance}
                            placeholderTextColor={theme.colors.secondaryText}
                        />
                    </View>
                    <View style={styles.inputBlock}>
                        <TextInput
                            secureTextEntry
                            numberOfLines={1}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="default"
                            autoCompleteType="off"
                            editable={!this.state.loading}
                            value={this.state.passwordToo}
                            placeholder="Повторите пароль"
                            onChangeText={this.onChangePasswordToo}
                            keyboardAppearance={theme.keyboardAppearance}
                            placeholderTextColor={theme.colors.secondaryText}
                        />
                    </View>
                    <Typography variant="body1" paragraph={16} color="secondary">
                        Минимальная длина пароля - 8 символов
                    </Typography>
                    <View style={{height: 20}} />
                    <Button
                        variant="contained"
                        alignContent="center"
                        loading={this.state.loading}
                        onPress={this.onPressConfirm}
                        disabled={this.state.password !== this.state.passwordToo || this.state.password.length < 8}>
                        {i18n.t('passwordSet.confirm')}
                    </Button>
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.PasswordSet';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(withTheme(PasswordSetScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
