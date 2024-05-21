// @flow
import _ from 'lodash';
import Color from 'color';
import React from 'react';
import {connect} from 'react-redux';
import {compareFnByIndex} from '../../utils';
import type {Account} from '../../constants';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import ServiceAdvertisingBlock from './ServiceAdvertisingBlock';
import {ReduxUtils, type ReduxState} from '../../reducers';
import * as R from 'ramda';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {emptyArray, emptyObject, type Partition, STATUS_BAR_HEIGHT} from '../../constants';
import {View, Animated, ScrollView, Dimensions, RefreshControl, InteractionManager} from 'react-native';
import {
    Button,
    Gradient,
    Carousel,
    EMoneyCard,
    Typography,
    ExchangeRates,
    PartitionsList,
    AdvertisingGroup,
} from '../../components';

import {getNC as getAccountDetailsNC} from '../AccountDetails';
import {getNC as getAccountInfoNC} from '../AccountInfo';

import Partitions from '../Partitions';
import LogIn from '../LogIn';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';
import Application from '../../modules/application';

export type Props = {
    componentId: any,
    language: string,
    theme: Theme,
};

type InternalProps = Props & {
    advertising: {[id: number]: any},
    hasAuthClient: boolean,
    accounts: Account[],
    client: any,
    styles: any,
};

type State = {
    refreshing: boolean,
    visibleExtraRates: boolean,
};

class WelcomeTabScreen extends React.Component<InternalProps, State> {
    accountsIndex: Animated.Value = new Animated.Value(0);
    scrollRef: ?ScrollView = null;
    syncRequest: any = null;
    mounted: boolean = false;
    state: State = {
        refreshing: false,
        visibleExtraRates: false,
    };

    componentDidMount() {
        this.mounted = true;
        this.syncRequest = doing.api.advertising.fetchAdvertising();
        InteractionManager.runAfterInteractions(() => {
            doing.api.services.getGroupsRequest().start();
            this.syncRequest.start();
        });
        // push inits
        Application.initPushNotifications();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.language !== prevProps.language) {
            if (this.syncRequest) {
                this.syncRequest.cancel();
            }
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    text: i18n.t('tabs.welcome'),
                },
            });
            this.syncRequest = doing.api.advertising.fetchAdvertising();
            doing.api.auth.refreshToken();
            this.syncRequest.start();
        }
    }

    filterPartitions = (partition: Partition): boolean => partition.viewType === 1;

    onScrollRef = (ref) => (this.scrollRef = ref);

    onEnableScroll = () => this.scrollRef && this.scrollRef.setNativeProps({scrollEnabled: true});

    onDisableScroll = () => this.scrollRef && this.scrollRef.setNativeProps({scrollEnabled: false});

    onPressAccount = (account: Account, openDetails: boolean = false) =>
        Navigation.push(
            this.props.componentId,
            (openDetails ? getAccountDetailsNC : getAccountInfoNC)(account, {
                isParentTabs: true,
            }),
        );

    onPressPartition = (partition: any) => {
        console.log('partition', partition);
        Partitions.open(this.props.componentId, partition);
    };

    onPressMoreExtraRates = () =>
        this.mounted &&
        this.setState({visibleExtraRates: true}, () =>
            setTimeout(() => this.scrollRef && this.scrollRef.scrollToEnd({animated: true}), 128),
        );

    onPressLogIn = () => LogIn.show();

    onRefresh = () =>
        this.mounted &&
        this.setState({refreshing: true}, () => {
            ReactNativeHapticFeedback.trigger('impactLight');
            if (this.props.hasAuthClient) {
                doing.api.accounts.getRequest().start();
            }
            doing.api.exchangerates.getRequest().start();
            doing.api.advertising
                .fetchAdvertising()
                .after(() => {
                    this.mounted && this.setState({refreshing: false});
                })
                .start();
        });

    renderAccountCard = (account: Account) => (
        <EMoneyCard
            withBonuses
            amount={account.balance}
            bonuses={account.points}
            currency={account.currency}
            color={this.props.theme.colors.button}
            onPress={() => this.onPressAccount(account)}
            qrCodeData={`${this.props.client.clientGuid}.${account.number}`}
            onPressQrCode={() => this.onPressAccount(account, true)}
        />
    );

    renderLogInAccountCard = (account: Account) => {
        const {styles, theme, hasAuthClient} = this.props;
        return (
            <EMoneyCard
                withBonuses
                onPress={hasAuthClient ? () => this.onPressAccount(account) : undefined}
                color={theme.colors.button}
                {...(hasAuthClient
                    ? {
                          amount: account.balance || 0,
                          bonuses: account.points || 0,
                          currency: account.currency || '',
                      }
                    : {amount: 0, bonuses: 0, currency: ''})}
                footer={
                    !hasAuthClient ? (
                        <View style={{paddingBottom: 6}}>
                            <Button
                                variant="uncontained"
                                alignContent="center"
                                style={styles.loginButton}
                                onPress={this.onPressLogIn}>
                                {i18n.t('welcome.logIn')}
                            </Button>
                        </View>
                    ) : (
                        account
                    )
                }
            />
        );
    };

    render() {
        const {styles, theme, accounts, advertising, componentId, hasAuthClient} = this.props;
        const {width} = Dimensions.get('window');
        console.log('ACCOUNT', this.props.client);
        return (
            <Animatable.View
                isInteraction
                duration={600}
                useNativeDriver
                testID="main-tab"
                animation="fadeIn"
                style={styles.container}>
                <ScrollView
                    style={{flex: 1}}
                    ref={this.onScrollRef}
                    directionalLockEnabled
                    contentInset={styles.contentInset}
                    contentOffset={{y: -(STATUS_BAR_HEIGHT + 8)}}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.onRefresh}
                            tintColor={theme.colors.button}
                            refreshing={this.state.refreshing}
                            progressViewOffset={styles.progressViewOffset}
                        />
                    }
                    contentInsetAdjustmentBehavior="never"
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={styles.contentContainer}>
                    <View style={styles.content}>
                        {!hasAuthClient ? (
                            this.renderLogInAccountCard(accounts[0])
                        ) : (
                            <Carousel
                                space={20}
                                width={width}
                                data={accounts}
                                preloadSize={6}
                                pivot={[0, 0.5]}
                                inactiveScale={0.8}
                                activationOffset={0}
                                velocityScale={0.334}
                                inactiveOpacity={0.8}
                                itemWidth={width - 40}
                                useMoveOutSelectionIndex
                                itemHeight={(width - 40) / 2.3}
                                renderItem={this.renderAccountCard}
                                onPanResponderGrant={this.onDisableScroll}
                                onPanResponderRelease={this.onEnableScroll}
                                outAnimatedSelectionIndex={this.accountsIndex}
                                footer={
                                    <Carousel.Indicator
                                        style={{marginRight: 40, marginBottom: 0}}
                                        indicatorColor={styles.indicatorColor}
                                        progress={this.accountsIndex}
                                        indicatorOpacity={0.5}
                                        indicatorPosition="top"
                                        dots={accounts.length}
                                    />
                                }
                            />
                        )}
                    </View>
                    <PartitionsList onPressPartition={this.onPressPartition} filter={this.filterPartitions} />
                    {_.values(advertising)
                        .sort(compareFnByIndex)
                        .map((group: any) => {
                            if (group.id === 2) {
                                return (
                                    <ServiceAdvertisingBlock
                                        key={`ag.${group.id}`}
                                        adversingData={group}
                                        componentId={componentId}
                                    />
                                );
                            }
                            return (
                                <AdvertisingGroup
                                    isParentTabs={true}
                                    key={`ag.${group.id}`}
                                    componentId={componentId}
                                    contentContainerStyle={styles.advertisingGroup}
                                    {...group}
                                />
                            );
                        })}
                    <ExchangeRates
                        visibleExtra={this.state.visibleExtraRates}
                        style={styles.content}
                        title={
                            <Typography style={{width: '100%', marginVertical: 10}} variant="title" color="primary">
                                {i18n.t('sections.exchangeRates')}
                            </Typography>
                        }
                    />
                </ScrollView>
                <Gradient
                    end={{x: 0, y: 1}}
                    start={{x: 0, y: 0.4}}
                    colors={[theme.colors.primaryBackground, Color(theme.colors.primaryBackground).alpha(0).toString()]}
                    style={{
                        height: STATUS_BAR_HEIGHT + 8,
                        position: 'absolute',
                        right: 0,
                        left: 0,
                        top: 0,
                    }}
                />
            </Animatable.View>
        );
    }
}

export const navigationName = 'app.WelcomeTab';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: passProps || {},
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => {
    const sectionType = R.pathOr(0, ['type'], ownerProps);
    return {
        advertising: (state.advertising || emptyObject)[sectionType] || emptyObject,
        accounts: (state.client.info || {}).accounts || emptyArray,
        hasAuthClient: ReduxUtils.hasAuthClient(state),
        client: state.client.info || {},
        pushNotifications: state.pushNotifications,
    };
})(withTheme(WelcomeTabScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
