// @flow
import React from 'react';
import {connect} from 'react-redux';
import ChooseAccount from '../../ChooseAccount';
import {Animated, Alert, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {ReduxUtils, type ReduxState} from '../../../reducers';
import {withTheme, type Theme, statusBarStyleGetter} from '../../../themes';
import {getMessage, formatNumber, overlapScreenScrollValue} from '../../../utils';
import {Image, NavBar, Button, Accessory, TextField, Typography, Containers} from '../../../components';

import {STATUS_BAR_HEIGHT, emptyArray, type Account, type Service} from '../../../constants';

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
    service: Service,
    isModal?: boolean,
    componentId: any,
    recipient: any,
    data: string,
    theme: Theme,
    styles: any,
};

type State = {
    error: any,
    price: string,
    filled: boolean,
    loading: boolean,
    account: ?Account,
};

class QtTransferFormScreen extends React.Component<Props, State> {
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
        error: null,
        filled: false,
        account: null,
        loading: false,
        recipient: null,
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
        if (!this.state.filled || !this.state.account || !this.props.service || !this.props.recipient) {
            return;
        }
        if (!((parseFloat(this.state.price) || 0) > 0)) {
            return;
        }
        this.mounted &&
            this.setState({loading: true}, () => {
                doing.api.services
                    .filledServiceFormRequest(
                        this.props.service.id,
                        this.props.service.code,
                        (this.state.account || {}).number,
                        [
                            {
                                code: 'Number',
                                value: this.props.recipient.clientGuid,
                            },
                            {
                                code: 'Data',
                                value: this.props.data,
                            },
                            {
                                code: 'Price',
                                value: this.state.price,
                            },
                        ],
                    )
                    .success((data: any) =>
                        Confirmation.show(
                            {
                                ...data,
                                service: this.props.service,
                                account: this.state.account,
                                recipient: this.props.recipient,
                            },
                            {
                                withOutEnterCode: data.result !== 3,
                                onClose: () => this.onPressClose(),
                            },
                        ),
                    )
                    .error((error: any) => {
                        this.mounted && this.setState({error, loading: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .start();
            });
    };

    onChangePrice = (text: string) =>
        this.mounted &&
        this.setState({
            filled: (parseFloat(text) || 0) > 0 && this.props.recipient && this.props.recipient.clientGuid,
            price: text,
        });

    onChooseAccount = (account: Account) => this.mounted && this.setState({account});

    onPressChooseAccount = () =>
        ChooseAccount.show({
            account: this.state.account,
            onChoose: this.onChooseAccount,
        });

    render() {
        const {styles, recipient, accounts, isModal} = this.props;
        const {price, filled, loading, account} = this.state;
        const amount = parseFloat(price) || 0;
        return (
            <View testID="qr-transfer-form" style={styles.container}>
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
                        {recipient ? (
                            <View style={styles.clientBlock}>
                                <Button size="large" variant="uncontained" style={styles.clientButton}>
                                    <Image
                                        resizeMode="cover"
                                        style={styles.clientImage}
                                        source={doing.api.files.sourceBy(recipient)}
                                    />
                                    <Typography style={{flex: 1}} variant="subheading" numberOfLines={2}>
                                        {recipient.name || i18n.t('settings.emptyName')}
                                    </Typography>
                                </Button>
                            </View>
                        ) : null}
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
                                    {i18n.t(`localTransferForm.actions.${amount > 0 ? 'send' : 'empty'}`, {
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
                    title={i18n.t('localTransferForm.title')}
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

export const navigationName = 'app.QtTransferForm';
export function getNC(service: Service, recipient: any, data: string, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                skipThemingStatusBar: true,
                recipient,
                service,
                data,
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
}))(withTheme(QtTransferFormScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
