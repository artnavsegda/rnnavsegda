// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import WebView from 'react-native-webview';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {doneByPromise, compareFnByIndex, getMessage} from '../../utils';
import {Accessory, Button, Containers, Typography} from '../../components';
import {Image, Keyboard, Platform, ActivityIndicator, Alert, View} from 'react-native';
import {API_AVAILABLE_CURRENCIES, API_ACCOUNT_CREATE, type AccountCurrency} from '../../constants';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

import CloseIconSource from '../../resources/icons/ic-close.png';

export type Props = {
    currencies: {[alfa3: string]: AccountCurrency},
    contractOffer?: string,
    onClose?: ?() => any,
    fetching: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    alfa3: ?string,
    step: number,
};

class CreateAccountScreen extends React.Component<Props, State> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;
    state: State = {
        alfa3: null,
        step: 0,
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

    onPressCurrency = (alfa3: string) => this.mounted && this.setState({alfa3});

    onPressNext = () => this.mounted && this.setState({step: 1});

    onPressConfirm = () =>
        this.state.alfa3 &&
        doing.api.accounts
            .createRequest(this.state.alfa3)
            .success(this.onPressClose)
            .error((err: any) => Alert.alert('Ошибка!', getMessage(err)))
            .start();

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    render() {
        const {styles, theme, currencies, contractOffer, fetching} = this.props;
        const isVerticalStretch = this.state.step > 0 && contractOffer;
        return (
            <Containers.BPS
                styles={{
                    ...styles.bps,
                    panel: {
                        ...styles.bps.panel,
                        height: isVerticalStretch ? '100%' : 'auto',
                    },
                }}
                useHardwareBackHandler
                ref={this.onBottomPanelRef}
                testID="create-account-panel"
                onPressBackdrop={this.onPressClose}
                contentContainerStyle={isVerticalStretch ? {flex: 1} : undefined}>
                <View style={styles.header}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="center">
                        {this.state.step > 0
                            ? i18n.t('createAccount.title')
                            : i18n.t('createAccount.selectCurrencyPlease')}
                    </Typography>
                    <Animatable.View delay={250} duration={334} useNativeDriver animation="fadeInRight">
                        <Button variant="icon" style={styles.closeButton} onPress={this.onPressClose}>
                            <Image style={styles.closeIcon} resizeMode="contain" source={CloseIconSource} />
                        </Button>
                    </Animatable.View>
                </View>
                <View style={isVerticalStretch ? {flex: 1} : undefined}>
                    {this.state.step < 1 ? (
                        <View style={styles.content}>
                            <View style={styles.currencies}>
                                {_.values(currencies)
                                    .sort(compareFnByIndex)
                                    .map((currency: AccountCurrency) =>
                                        !currency.isAccount ? (
                                            <View key={currency.alfa3} style={styles.currencyItem}>
                                                <Button
                                                    alignContent="center"
                                                    style={styles.currency}
                                                    onPress={() => this.onPressCurrency(currency.alfa3)}
                                                    variant={
                                                        currency.alfa3 === this.state.alfa3 ? 'contained' : 'outlined'
                                                    }>
                                                    {currency.alfa3}
                                                </Button>
                                            </View>
                                        ) : null,
                                    )}
                            </View>
                            <Button
                                loading={fetching}
                                variant="contained"
                                onPress={this.onPressNext}
                                alignContent="space-between"
                                disabled={fetching || !this.state.alfa3}
                                accessory={<Accessory size={14} variant="button" />}>
                                {i18n.t('createAccount.next')}
                            </Button>
                        </View>
                    ) : (
                        <>
                            {contractOffer ? (
                                <View style={{flex: 1}}>
                                    <WebView
                                        style={styles.webView}
                                        originWhitelist={['*']}
                                        startInLoadingState={true}
                                        renderLoading={() => (
                                            <View style={styles.loader}>
                                                <ActivityIndicator size="large" color={theme.colors.button} animating />
                                            </View>
                                        )}
                                        source={{uri: contractOffer}}
                                    />
                                </View>
                            ) : null}
                            <View style={styles.content}>
                                <Button
                                    loading={fetching}
                                    variant="contained"
                                    alignContent="space-between"
                                    onPress={this.onPressConfirm}
                                    accessory={<Accessory size={14} variant="button" />}>
                                    {i18n.t('createAccount.confirm')}
                                </Button>
                            </View>
                        </>
                    )}
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.CreateAccount';
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

export function show(props: any = {}) {
    return Navigation.showModal(getNC(props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    currencies: state.availableCurrencies,
    contractOffer: (state.auth.info || {}).contractOffer,
    fetching: ReduxUtils.hasFetching(state, [API_AVAILABLE_CURRENCIES, API_ACCOUNT_CREATE]),
}))(withTheme(CreateAccountScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
