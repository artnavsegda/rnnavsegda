// @flow
import React from 'react';
import {connect} from 'react-redux';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {doneByPromise, getMessage} from '../../utils';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {Button, Containers, Typography} from '../../components';
import {API_IDENTIFICATION_CLIENT, type ClientInfo} from '../../constants';
import {Image, Keyboard, ActivityIndicator, Platform, View, TextInput} from 'react-native';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    client?: ClientInfo,
    loading?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    code: string,
    error: string,
    ready: boolean,
};

class IdentificationScreen extends React.Component<Props, State> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;
    state: State = {
        ready: false,
        error: '',
        code: '',
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

    componentDidAppear() {
        doing.api.client
            .identificationNewCodeRequest()
            .error((error: any) => this.mounted && this.setState({ready: true, error: getMessage(error)}))
            .success(() => this.mounted && this.setState({ready: true, error: ''}))
            .start();
    }

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

    onPressConfirm = () => {
        if (this.state.code.length < 5) {
            return;
        }
        Keyboard.dismiss();
        doing.api.client
            .identificationCheckCodeRequest(this.state.code)
            .error((error: any) => this.mounted && this.setState({error: getMessage(error)}))
            .success(() => this.onPressClose())
            .start();
    };

    onChangeCode = (text: string) => this.setState({code: text});

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    render() {
        const {styles, theme, loading} = this.props;
        return (
            <Containers.BPS
                styles={styles.bps}
                useHardwareBackHandler
                testID="identification"
                ref={this.onBottomPanelRef}>
                <View style={styles.header}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="center">
                        {i18n.t('identification.title')}
                    </Typography>
                    {/*
                    <Animatable.View delay={250} duration={334} useNativeDriver animation="fadeInRight">
                        <Button variant="icon" style={styles.closeButton} onPress={this.onPressClose}>
                            <Image
                                resizeMode="contain"
                                style={styles.closeIcon}
                                source={require('../../resources/icons/ic-close.png')}
                            />
                        </Button>
                    </Animatable.View>
                    */}
                </View>
                <View style={styles.content}>
                    {this.state.ready ? (
                        <>
                            {this.state.error.length > 0 ? (
                                <Typography variant="body1" paragraph={32} color="error">
                                    {this.state.error}
                                </Typography>
                            ) : (
                                <>
                                    <View style={styles.inputBlock}>
                                        <TextInput
                                            maxLength={5}
                                            secureTextEntry
                                            autoFocus={true}
                                            numberOfLines={1}
                                            style={styles.input}
                                            autoCapitalize="none"
                                            autoCompleteType="off"
                                            value={this.state.code}
                                            keyboardType="number-pad"
                                            textContentType="oneTimeCode"
                                            onChangeText={this.onChangeCode}
                                            keyboardAppearance={theme.keyboardAppearance}
                                            placeholderTextColor={theme.colors.secondaryText}
                                        />
                                    </View>
                                    <Typography variant="body1" paragraph={16} color="secondary">
                                        {i18n.t('identification.text')}
                                    </Typography>
                                </>
                            )}
                            <View style={styles.actions}>
                                <Button
                                    loading={loading}
                                    variant="contained"
                                    alignContent="center"
                                    disabled={this.state.code.length < 5 && this.state.error.length < 1}
                                    onPress={this.state.error.length > 0 ? this.onPressClose : this.onPressConfirm}>
                                    {this.state.error.length > 0
                                        ? i18n.t('identification.close')
                                        : i18n.t('identification.confirm')}
                                </Button>
                            </View>
                        </>
                    ) : (
                        <View style={styles.loader}>
                            <ActivityIndicator color={theme.colors.button} size="large" animating />
                        </View>
                    )}
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.Identification';
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
    loading: ReduxUtils.hasFetching(state, [API_IDENTIFICATION_CLIENT]) || false,
    client: state.client.info,
}))(withTheme(IdentificationScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
