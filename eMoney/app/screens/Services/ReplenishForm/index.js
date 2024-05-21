// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import CCType from 'credit-card-type';
import {Animated, Alert, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {withTheme, type Theme, statusBarStyleGetter} from '../../../themes';
import * as Animatable from 'react-native-animatable';
import {ReduxUtils, type ReduxState} from '../../../reducers';
import {getMessage, formatNumber, formatCardNumber, overlapScreenScrollValue} from '../../../utils';
import {
    NavBar,
    Button,
    TextField,
    Accessory,
    Typography,
    Containers,
    ChooseAccountPopupLayer,
} from '../../../components';

import {STATUS_BAR_HEIGHT, NAV_BAR_HEIGHT, emptyArray, type Account} from '../../../constants';

import currency from '../../../currency';
import doing from '../../../doing';
import i18n from '../../../i18n';

import getStyles from './styles';
import ServiceLogo from '../../../resources/svg/logo.svg';
import ChooseAccount from '../../ChooseAccount';

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
    cardType: string,
    account: ?Account,
    cardNumber: string,
};

class ReplenishFormScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (!state.account) {
            if (props.account || props.accounts.length > 0) {
                return {
                    account: state.account || props.account || (props.accounts.length > 0 ? props.accounts[0] : null),
                };
            }
        }
        return null;
    }
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    mounted: boolean = false;
    state: State = {
        price: '',
        cardType: '',
        filled: false,
        loading: false,
        account: null,
        cardNumber: '',
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
        if (!this.state.filled || !this.state.account) {
            return;
        }
        const amount = parseFloat(this.state.price) || 0;
        if (!(amount > 0)) {
            return;
        }
        this.mounted &&
            this.setState({loading: true}, () => {
                doing.api.accounts
                    .rechargeRequest(
                        (this.state.account || {}).number,
                        parseInt(this.state.cardNumber.replace(/(\W+)/gi, ''), 10) || 0,
                        amount,
                    )
                    .error((error: any) => {
                        this.mounted && this.setState({loading: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .success(() => this.onPressClose())
                    .start();
            });
    };

    onChangeCardNumber = (text: string) => {
        const card = _.first(CCType(text));
        this.mounted &&
            this.setState({
                cardNumber: text,
                cardType: text.length > 0 ? (card ? card.niceType : '') : '',
                filled: (parseFloat(this.state.price) || 0) > 0 && text.length > 4,
            });
    };

    onChangePrice = (text: string) =>
        this.mounted &&
        this.setState({price: text, filled: (parseFloat(text) || 0) > 0 && this.state.cardNumber.length > 4});

    onChooseAccount = (account: Account) => this.mounted && this.setState({account});

    onPressChooseAccount = () =>
        ChooseAccount.show({
            account: this.state.account,
            onChoose: this.onChooseAccount,
        });

    render() {
        const {styles, accounts, isModal} = this.props;
        const {price, cardNumber, cardType, filled, loading, account} = this.state;
        const amount = parseFloat(price) || 0;
        return (
            <View testID="replenish-form" style={styles.container}>
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
                            title={cardType}
                            value={cardNumber}
                            formatText={formatCardNumber}
                            disabled={loading || !account}
                            label={i18n.t('replenishForm.cardNumber')}
                            inputProps={{
                                textContentType: 'creditCardNumber',
                                autoCompleteType: 'cc-number',
                                keyboardType: 'number-pad',
                                autoCapitalize: 'none',
                                autoCorrect: false,
                            }}
                            onChangeText={this.onChangeCardNumber}
                        />
                        <TextField
                            value={price}
                            formatText={formatNumber}
                            label={i18n.t('replenishForm.price')}
                            disabled={loading || !account}
                            inputProps={{
                                keyboardType: 'decimal-pad',
                                autoCompleteType: 'off',
                                autoCapitalize: 'none',
                                autoCorrect: false,
                            }}
                            onChangeText={this.onChangePrice}
                        />
                        {account ? (
                            <Animatable.View
                                duration={400}
                                useNativeDriver
                                animation="fadeIn"
                                style={this.props.styles.actionBlock}>
                                <Button
                                    loading={loading}
                                    disabled={!filled}
                                    variant="contained"
                                    alignContent="center"
                                    onPress={this.onPressAction}>
                                    {i18n.t(`replenishForm.actions.${amount > 0 ? 'ok' : 'empty'}`, {
                                        amount: amount > 0 ? currency(amount, account.currency).format(true) : '',
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
                    title={i18n.t('replenishForm.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}>
                    <View style={styles.navBarInfo}>
                        <Button
                            variant="contained"
                            style={styles.accountButton}
                            tintColor={styles.headerTintColor}
                            disabled={this.state.loading || accounts.length < 2}
                            onPress={accounts.length > 1 ? this.onPressChooseAccount : undefined}
                            accessory={accounts.length > 1 ? <Accessory variant="button" size={12} /> : undefined}>
                            <View style={{flex: 1, paddingTop: 4}}>
                                <View style={styles.accountNumberBlock}>
                                    <ServiceLogo width={10} height={10} style={{marginRight: 8}} />
                                    <Typography
                                        fontSize={12}
                                        variant="body1"
                                        numberOfLines={1}
                                        color={styles.headerTintColor}>
                                        {account ? account.number : ''}
                                    </Typography>
                                </View>
                                <Typography
                                    fontSize={28}
                                    fontWeight="400"
                                    numberOfLines={1}
                                    variant="display1"
                                    color={styles.headerTintColor}>
                                    {account ? currency(account.balance, account.currency).format(true) : ''}
                                </Typography>
                            </View>
                        </Button>
                    </View>
                </NavBar>
            </View>
        );
    }
}

export const navigationName = 'app.ReplenishForm';
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
}))(withTheme(ReplenishFormScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
