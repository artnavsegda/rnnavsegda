// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import ChooseAccount from '../../ChooseAccount';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {Animated, Alert, Image, View, InteractionManager} from 'react-native';
import {ReduxUtils, type ReduxState} from '../../../reducers';
import {withTheme, type Theme, statusBarStyleGetter} from '../../../themes';
import {getMessage, formatNumber, overlapScreenScrollValue} from '../../../utils';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import {Containers, NavBar, TextField, Typography, Button, Accessory, EmptyAccount} from '../../../components';
import {STATUS_BAR_HEIGHT, emptyArray, type Account, type RateResult} from '../../../constants';
import LogIn from '../../LogIn';

import Confirmation from '../../Confirmation';

import currency from '../../../currency';
import doing from '../../../doing';
import i18n from '../../../i18n';

import getStyles from './styles';

import ServiceLogo from '../../../resources/svg/logo.svg';

export type Props = {
    isParentTabs?: boolean,
    hasAuthClient: boolean,
    hasNetwork: boolean,
    accounts: Account[],
    account?: Account,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    price: string,
    filled: boolean,
    loading: boolean,
    rate: ?RateResult,
    toAccount: ?Account,
    type: 'send' | 'get',
    fromAccount: ?Account,
};

class LocalTransferFormScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (!state.fromAccount && (props.account || props.accounts.length > 0)) {
            return {
                fromAccount:
                    state.fromAccount || props.account || (props.accounts.length > 0 ? props.accounts[0] : null),
            };
        }
        return null;
    }
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    mounted: boolean = false;
    state: State = {
        price: '',
        rate: null,
        type: 'send',
        filled: false,
        loading: false,
        toAccount: null,
        fromAccount: null,
    };

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: this.scrollY,
                    },
                },
            },
        ],
        {useNativeDriver: true},
    );

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onPressAction = () => {
        if (!this.state.filled || !this.state.fromAccount || !this.state.toAccount) {
            return;
        }
        const amount = this.getAmount();
        if (!(amount > 0)) {
            return;
        }
        this.mounted &&
            this.setState({loading: true}, () => {
                doing.api.accounts
                    .transferRequest((this.state.fromAccount || {}).number, (this.state.toAccount || {}).number, amount)
                    .error((error: any) => {
                        this.mounted && this.setState({loading: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .success((data: any) => {
                        return Confirmation.show(
                            {
                                ...data,
                                account: this.state.toAccount,
                            },
                            {
                                withOutEnterCode: data.result !== 3,
                                onClose: () => this.onPressClose(),
                            },
                        );
                    })
                    .start();
            });
    };

    onChangePrice = (text: string) => this.mounted && this.setState({price: text, filled: (parseFloat(text) || 0) > 0});

    onPressSwapAccounts = () =>
        this.mounted &&
        this.setState({
            fromAccount: this.state.toAccount,
            toAccount: this.state.fromAccount,
        });

    onPressSwapOperationType = () =>
        this.mounted &&
        this.setState({
            type: this.state.type === 'send' ? 'get' : 'send',
        });

    onPressChooseAccount = (isFrom: boolean = false) =>
        ChooseAccount.show({
            account: isFrom ? this.state.fromAccount : this.state.toAccount,
            onChoose: (account: Account) => this.onChooseAccount(account, isFrom),
        });

    onChooseAccount = (account: Account, isFrom: boolean = false) =>
        this.mounted &&
        this.setState(isFrom ? {fromAccount: account} : {toAccount: account}, () => {
            if (
                !(
                    this.state.toAccount &&
                    this.state.fromAccount &&
                    this.state.fromAccount.currency !== this.state.toAccount.currency
                )
            ) {
                return this.mounted && this.setState({rate: null});
            }

            InteractionManager.runAfterInteractions(() => {
                doing.api.currencies
                    .getRateRequest(this.state.fromAccount.currency, this.state.toAccount.currency)
                    .error((error) => {
                        console.log('RATE ERROR', error);
                        this.mounted && this.setState({rate: null, loading: false});

                        Alert.alert('Ошибка', getMessage(error));
                    })
                    .success((rate: any) => {
                        console.log('SERVER RATE', rate);
                        this.mounted && this.setState({rate});
                    })
                    .start();
            });
        });

    rateValue = (rate: RateResult, amount: number, key: string, currencyFrom: string): number => {
        if (rate.currencyFrom === currencyFrom) {
            return (amount * rate.quantity) / rate[key];
        }
        return (amount * rate[key]) / rate.quantity;
    };

    onPressLogIn = () => LogIn.show();

    getAmount = (): number => {
        const v = parseFloat(this.state.price) || 0;
        return this.state.type === 'send'
            ? v
            : this.state.rate && this.state.toAccount
            ? this.rateValue(
                  this.state.rate,
                  v,
                  this.state.toAccount.currency !== this.state.rate.currencyTo ? 'pay' : 'sale',
                  this.state.toAccount.currency,
              )
            : 0;
    };

    renderRateResult = () => {
        const {rate, type, price, fromAccount, toAccount} = this.state;
        if (!rate || !fromAccount || !toAccount) {
            return undefined;
        }
        const v = parseFloat(price) || 0,
            key = toAccount.currency !== rate.currencyTo ? 'pay' : 'sale',
            currencyFrom = type === 'send' ? fromAccount.currency : toAccount.currency,
            currencyTo = type === 'send' ? toAccount.currency : fromAccount.currency;

        const amount = this.rateValue(rate, v, key, currencyFrom);
        const _t = currency(rate.quantity || 1, rate.currencyTo);

        return (
            <Typography variant="body1">
                {amount > 0 ? (
                    <Typography variant="body1" fontWeight="bold">
                        {currency(amount, currencyTo).format(true)} {',  '}
                    </Typography>
                ) : null}
                {_t.format(true).replace(_t.toString(), `${rate.quantity || 1}`)} ={' '}
                {currency(rate[key] || 1, rate.currencyFrom).format(true)}
            </Typography>
        );
    };

    renderRightAccessory = () =>
        this.state.toAccount ? (
            <Button
                variant="icon"
                onPress={this.onPressSwapOperationType}
                style={this.props.styles.fieldAccessory}
                hitSlop={{left: 4, right: 4, top: 4, bottom: 4}}>
                <Image
                    resizeMode="contain"
                    style={this.props.styles.fieldAccessoryIcon}
                    source={require('../../../resources/icons/ic-swap-vertical.png')}
                />
            </Button>
        ) : null;

    //-------------------------------------------------
    // render auth screen
    //-------------------------------------------------
    renderAuthScreen = () => {
        return <EmptyAccount onPressLogIn={this.onPressLogIn} />;
    };

    render() {
        const {styles, accounts, isModal, hasAuthClient} = this.props;
        const {price, type, filled, rate, loading, fromAccount, toAccount} = this.state;
        const operationAccount = type === 'send' ? fromAccount : toAccount;
        const amount = this.getAmount();

        console.log('RATE', rate);

        if (!hasAuthClient) {
            return (
                <View style={{flex: 1}}>
                    {this.renderAuthScreen()}
                    <NavBar
                        useHardwareBackHandler
                        style={styles.fixedNavBar}
                        onPressBack={this.onPressClose}
                        title={i18n.t('serviceForm.title')}
                        showBackButton={isModal ? 'close' : true}
                        scrollY={overlapScreenScrollValue(this.scrollY)}
                        translucentStatusBar={isModal ? 'adaptive' : true}
                    />
                </View>
            );
        }

        return (
            <View testID="local-transfer-form" style={styles.container}>
                <Containers.KeyboardAvoiding style={{flex: 1}}>
                    <Animated.ScrollView
                        style={styles.list}
                        removeClippedSubviews
                        directionalLockEnabled
                        onScroll={this.onScroll}
                        keyboardShouldPersistTaps="handled"
                        contentInsetAdjustmentBehavior="never"
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.listContentContainer}>
                        <TextField
                            value={price}
                            formatText={formatNumber}
                            suffix={operationAccount ? operationAccount.currency : undefined}
                            label={i18n.t(`localTransferForm.price${_.upperFirst(type)}`)}
                            disabled={
                                loading ||
                                !toAccount ||
                                !fromAccount ||
                                (toAccount && fromAccount && fromAccount.number === toAccount.number)
                            }
                            inputProps={{
                                keyboardType: 'decimal-pad',
                                autoCompleteType: 'off',
                                autoCapitalize: 'none',
                                autoCorrect: false,
                            }}
                            renderRightAccessory={this.renderRightAccessory}
                            onChangeText={this.onChangePrice}
                        />
                        {this.renderRateResult()}
                        {toAccount ? (
                            <Animatable.View
                                duration={400}
                                useNativeDriver
                                animation="fadeIn"
                                style={this.props.styles.actionBlock}>
                                <Button
                                    loading={loading}
                                    variant="contained"
                                    alignContent="center"
                                    onPress={this.onPressAction}
                                    disabled={
                                        !filled ||
                                        (toAccount && fromAccount && fromAccount.number === toAccount.number) ||
                                        (toAccount &&
                                            fromAccount &&
                                            fromAccount.currency !== toAccount.currency &&
                                            !rate)
                                    }>
                                    {i18n.t(`localTransferForm.actions.${amount > 0 ? 'send' : 'empty'}`, {
                                        amount:
                                            amount > 0 && fromAccount
                                                ? currency(amount, fromAccount.currency).format(true)
                                                : '',
                                    })}
                                </Button>
                            </Animatable.View>
                        ) : null}
                    </Animated.ScrollView>
                </Containers.KeyboardAvoiding>
                <NavBar
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    onPressBack={this.onPressClose}
                    showBackButton={isModal ? 'close' : true}
                    title={i18n.t('localTransferForm.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}>
                    <View style={styles.navBarInfo}>
                        <Button
                            variant="contained"
                            style={styles.accountButton}
                            tintColor={styles.headerTintColor}
                            disabled={this.state.loading || accounts.length < 2}
                            accessory={accounts.length > 1 ? <Accessory variant="button" size={12} /> : undefined}
                            onPress={accounts.length > 1 ? () => this.onPressChooseAccount(true) : undefined}>
                            <View style={{flex: 1, paddingTop: 4}}>
                                <View style={styles.accountNumberBlock}>
                                    <ServiceLogo width={10} height={10} style={{marginRight: 8}} />
                                    <Typography
                                        variant="body1"
                                        numberOfLines={1}
                                        fontSize={12}
                                        color={styles.headerTintColor}>
                                        {fromAccount ? fromAccount.number : ''}
                                    </Typography>
                                </View>
                                <Typography
                                    fontSize={28}
                                    fontWeight="400"
                                    numberOfLines={1}
                                    variant="display1"
                                    color={styles.headerTintColor}>
                                    {fromAccount
                                        ? currency(fromAccount.balance, fromAccount.currency).format(true)
                                        : ''}
                                </Typography>
                            </View>
                        </Button>
                        <View style={{height: 10}} />
                        <Button
                            variant="contained"
                            tintColor={styles.headerTintColor}
                            disabled={this.state.loading || accounts.length < 2}
                            style={[styles.accountButton, styles.secondaryAccountButton]}
                            accessory={accounts.length > 1 ? <Accessory variant="button" size={12} /> : undefined}
                            onPress={accounts.length > 1 ? () => this.onPressChooseAccount(false) : undefined}>
                            {toAccount ? (
                                <View style={{flex: 1, paddingTop: 4}}>
                                    <View style={styles.accountNumberBlock}>
                                        <ServiceLogo width={10} height={10} style={{marginRight: 8}} />
                                        <Typography
                                            fontSize={12}
                                            variant="body1"
                                            numberOfLines={1}
                                            color={styles.headerTintColor}>
                                            {toAccount.number}
                                        </Typography>
                                    </View>
                                    <Typography
                                        fontSize={28}
                                        fontWeight="400"
                                        numberOfLines={1}
                                        variant="display1"
                                        color={styles.headerTintColor}>
                                        {currency(toAccount.balance, toAccount.currency).format(true)}
                                    </Typography>
                                </View>
                            ) : (
                                i18n.t('localTransferForm.chooseToAccount')
                            )}
                        </Button>
                        {fromAccount && toAccount && toAccount.number !== fromAccount.number ? (
                            <TouchableBounce style={styles.swapAccountsButton} onPress={this.onPressSwapAccounts}>
                                <Image
                                    resizeMode="contain"
                                    style={styles.swapAccountsIcon}
                                    source={require('../../../resources/icons/ic-swap-vertical.png')}
                                />
                            </TouchableBounce>
                        ) : null}
                    </View>
                </NavBar>
            </View>
        );
    }
}

export const navigationName = 'app.LocalTransferForm';
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
                statusBar: {
                    visible: true,
                    drawBehind: true,
                    backgroundColor: 'transparent',
                    style: statusBarStyleGetter(doing.theme.currentTheme()),
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    accounts: (state.client.info || {}).accounts || emptyArray,
    hasAuthClient: ReduxUtils.hasAuthClient(state),
    hasNetwork: state.indicators.net === 'online',
}))(withTheme(LocalTransferFormScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
