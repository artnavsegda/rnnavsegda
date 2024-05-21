// @flow
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import { View, Dimensions, Text, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { ReduxState } from '../../../reducers';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { withTheme, type Theme } from '../../../themes';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { NavBar, Button, Typography, Accessory, Image } from '../../../components';
import { MIN_SCREEN_SIZE, type Account, type ClientInfo } from '../../../constants';

import currency from '../../../currency';
import doing from '../../../doing';
import i18n from '../../../i18n';
import * as R from 'ramda';

import getStyles from './styles';

const SCREEN_STATE = {
    INITIAL: 0,
    FETCHING_CLIENT_DATA: 1,
    CLIENT_NOT_FOUND: 2,
    CLIENT_WAS_FOUND: 3,
};

export type Props = {
    onConfirmDetection?: (client: any, data: string) => any,
    componentId: any,
    styles: any,
    theme: Theme,
};

type InternalProps = {
    ...Props,
    accounts: Account[],
    client: ?ClientInfo,
};

type State = {
    activeSlide: number,
    mode: 'camera' | 'accounts',
    barCode: ?{
        target: number,
        data: string,
    },
    client: any,
    screenState: number,
};

class CameraDetectClientScreen extends React.Component<InternalProps, State> {
    activeRequest: ?Request = null;
    codeRead: Boolean = false;
    state: State = {
        client: null,
        barCode: null,
        mode: 'camera',
        activeSlide: 0,
        screenState: SCREEN_STATE.INITIAL,
    };

    componentDidUpdate() {
        const { screenState } = this.state;

        // reset screen state
        if (screenState > 1 && screenState !== 3) {
            setTimeout(() => {
                this.setState({ screenState: SCREEN_STATE.INITIAL }, () => {
                    this.codeRead = false;
                });
            }, 3000);
        }
    }

    onPressClose = () => {
        return Navigation.dismissModal(this.props.componentId);
    };

    onDetectClient = () => {
        if (!this.state.barCode) {
            return;
        }
        if (this.activeRequest) {
            this.activeRequest.cancel();
        }

        console.log('DETECT CLIENT', _.first(this.state.barCode.data.split('.') || []));

        this.activeRequest = doing.api.client
            .findClientRequest(_.first(this.state.barCode.data.split('.')))
            .success((data: any) => {
                console.log('DETECT CLIENT RESPONSE', data);
                if (!data) {
                    return;
                }
                const clientGuid = R.pathOr(false, ['clientGuid'], data);
                if (clientGuid) {
                    this.setState({ client: data, screenState: SCREEN_STATE.CLIENT_WAS_FOUND });
                } else {
                    this.setState({ screenState: SCREEN_STATE.CLIENT_NOT_FOUND });
                }
            })
            .error((error) => {
                console.log('CLIENT', error);
                this.setState({ screenState: SCREEN_STATE.CLIENT_NOT_FOUND });
            });
        if (this.activeRequest) {
            this.activeRequest.start();
        }
    };

    onBarCodeRead = (event) => {
        if (!this.codeRead) {
            // check
            const data = R.pathOr(false, ['data'], event);
            const target = R.pathOr('unknown', ['target'], event);

            // change flag
            this.codeRead = true;

            if (!data) {
                this.setState({ screenState: SCREEN_STATE.CLIENT_NOT_FOUND });
            } else {
                this.setState(
                    {
                        barCode: {
                            target,
                            data,
                        },
                        screenState: SCREEN_STATE.FETCHING_CLIENT_DATA,
                    },
                    () => this.onDetectClient(),
                );
            }
        }
    };

    onPressChangeMode = () => this.setState({ mode: this.state.mode === 'accounts' ? 'camera' : 'accounts' });

    onPressSelectClient = () => {
        const { client, barCode } = this.state;
        if (!(client && client.clientGuid)) {
            return;
        }
        const { onConfirmDetection } = this.props;
        return this.onPressClose().then(
            () =>
                onConfirmDetection &&
                onConfirmDetection(client, ((barCode || {}).data || '').split('.').slice(1).join('.')),
        );
    };

    renderAccountInfo = ({ item }) => (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View
                style={{
                    padding: 8,
                    marginTop: 8,
                    borderRadius: 8,
                    marginBottom: 20,
                    backgroundColor: '#fff',
                }}>
                <QRCode
                    color="#000"
                    backgroundColor="rgba(0,0,0,0)"
                    size={MIN_SCREEN_SIZE * 0.6 - 40}
                    value={`${this.props.client?.clientGuid || ''}.${item.number}`}
                />
            </View>
            <Typography paragraph variant="body1">
                <Typography variant="body1" fontWeight="bold">
                    {i18n.t('accountDetails.accountNumber')}:{' '}
                </Typography>
                {item.number || 'EM###########'}
            </Typography>
            <Typography paragraph variant="body1">
                <Typography variant="body1" fontWeight="bold">
                    {i18n.t('accountDetails.accountCurrency')}:{' '}
                </Typography>
                {(item.currency || '').toUpperCase()}
            </Typography>
            <Typography paragraph variant="display1">
                {currency(item.balance, item.currency).format(true)}
            </Typography>
        </View>
    );

    renderUICameraResponse = () => {
        const { client, screenState } = this.state;
        const { styles, theme } = this.props;

        if (screenState === SCREEN_STATE.FETCHING_CLIENT_DATA) {
            return (
                <Animatable.View duration={400} useNativeDriver animation="fadeInUp" style={styles.clientBlock}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 8,
                        }}>
                        <ActivityIndicator size={'large'} color={theme.colors.notifications} />
                        <Text style={{ fontSize: 14, marginLeft: 12, color: theme.colors.primaryText }}>
                            {i18n.t('qrScaner.fetchingClientData')}
                        </Text>
                    </View>
                </Animatable.View>
            );
        } else if (screenState === SCREEN_STATE.CLIENT_WAS_FOUND) {
            return (
                <Animatable.View duration={400} useNativeDriver animation="fadeInUp" style={styles.clientBlock}>
                    <Button
                        size="large"
                        tintColor="#252525"
                        variant="uncontained"
                        style={styles.clientButton}
                        onPress={this.onPressSelectClient}
                        accessory={<Accessory variant="button" size={12} />}>
                        <Image
                            resizeMode="cover"
                            style={styles.clientImage}
                            source={doing.api.files.sourceBy(client)}
                        />
                        <Typography style={{ flex: 1 }} color="#252525" variant="subheading" numberOfLines={2}>
                            {client.name || i18n.t('settings.emptyName')}
                        </Typography>
                    </Button>
                </Animatable.View>
            );
        } else if (screenState === SCREEN_STATE.CLIENT_NOT_FOUND) {
            return (
                <Animatable.View duration={400} useNativeDriver animation="fadeInUp" style={styles.clientBlock}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 8,
                        }}>
                        <Text style={{ fontSize: 14, marginLeft: 12, color: theme.colors.primaryText }}>
                            {i18n.t('qrScaner.clientNotFound')}
                        </Text>
                    </View>
                </Animatable.View>
            );
        }
    };

    render() {
        const { mode, activeSlide } = this.state;
        const { styles, theme, accounts } = this.props;
        const { width } = Dimensions.get('window');
        return (
            <View testID="camera-detect-client" style={styles.container}>
                {mode === 'accounts' ? (
                    <View style={styles.content}>
                        <Pagination
                            dotsLength={accounts.length}
                            activeDotIndex={activeSlide}
                            dotStyle={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                marginHorizontal: 8,
                                backgroundColor: theme.colors.primaryText,
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                        <Carousel
                            loop
                            width={width}
                            data={accounts}
                            sliderWidth={width}
                            inactiveScale={0.8}
                            inactiveOpacity={0.8}
                            itemWidth={width - 20}
                            renderItem={this.renderAccountInfo}
                            style={{ flex: 1, marginBottom: 12 }}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        />
                    </View>
                ) : (
                    <>
                        <RNCamera
                            captureAudio={false}
                            style={styles.preview}
                            type={RNCamera.Constants.Type.back}
                            //flashMode={RNCamera.Constants.FlashMode.on}
                            //barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'Ok',
                            }}
                            onBarCodeRead={this.onBarCodeRead}
                        />
                        {this.renderUICameraResponse()}
                    </>
                )}
                <NavBar
                    showBackButton
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    onPressBack={this.onPressClose}
                    translucentStatusBar="adaptive"
                    title={mode === 'qr' ? 'Счета' : undefined}
                    tintColor={mode !== 'qr' ? '#fff' : undefined}
                    rightItems={[
                        {
                            text: mode !== 'accounts' ? 'Мои счета' : 'Камера',
                            onPress: this.onPressChangeMode,
                        },
                    ]}
                />
            </View>
        );
    }
}

export const navigationName = 'app.CameraDetectClient';
function getNC(passProps: any = {}, options: any = {}) {
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
                    backgroundColor: '#000',
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
    accounts: state.client.info?.accounts || [],
    client: state.client.info,
}))(withTheme(CameraDetectClientScreen, getStyles));

reduxConnector.show = (props: any) => {
    return Navigation.showModal(getNC(props));
};
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
