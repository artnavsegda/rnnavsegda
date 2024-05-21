// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {Animated, InteractionManager, View} from 'react-native';
import {compareFnByIndex, overlapScreenScrollValue} from '../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {NavBar, Typography, Button, EMoneyCard, AdvertisingGroup} from '../../components';
import {EmptyAccount} from '../../components/UIKit';
import {emptyArray, STATUS_BAR_HEIGHT, type Account, emptyObject} from '../../constants';
import * as R from 'ramda';
import {getNC as getAccountDetailsNC} from '../AccountDetails';
import {getNC as getAccountInfoNC} from '../AccountInfo';
import CreateAccount from '../CreateAccount';
import LogIn from '../LogIn';

import currency from '../../currency';
import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

import PlusIcon from '../../resources/svg/plus.svg';

export type Props = {
    hasAddAccount: boolean,
    hasAuthClient: boolean,
    accounts: Account[],
    isModal?: boolean,
    advertising: any,
    componentId: any,
    language: string,
    theme: Theme,
    styles: any,
};

class CardsTabScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    subscriptions: any[] = [];

    componentDidMount() {
        this.subscriptions = [Navigation.events().bindComponent(this)];
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription: any) => subscription.remove());
    }

    componentDidAppear() {
        InteractionManager.runAfterInteractions(() => {
            doing.api.accounts.getAvailableCurrenciesRequest().start();
            doing.api.accounts.getRequest().start();
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.language !== prevProps.language) {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    text: i18n.t('tabs.cards'),
                },
            });
        }
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

    onPressLogIn = () => LogIn.show();

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });
        // return Navigation.pop(this.props.componentId);
    };

    onPressAddAccount = () => CreateAccount.show();

    onPressAccount = (account: Account) => {
        if (this.props.accounts.length < 2 && !this.props.hasAddAccount) {
            return Navigation.push(
                this.props.componentId,
                getAccountDetailsNC(account, {
                    isParentTabs: true,
                }),
            );
        }
        return Navigation.push(
            this.props.componentId,
            getAccountInfoNC(account, {
                isParentTabs: true,
            }),
        );
    };

    render() {
        const {styles, theme, accounts, advertising, componentId, hasAuthClient, hasAddAccount} = this.props;
        return (
            <View testID="cards-tab" style={styles.container}>
                {!hasAuthClient ? (
                    <EmptyAccount onPressLogIn={this.onPressLogIn} />
                ) : (
                    <>
                        <Animated.ScrollView
                            style={styles.list}
                            removeClippedSubviews
                            directionalLockEnabled
                            onScroll={this.onScroll}
                            automaticallyAdjustContentInsets={false}
                            contentInsetAdjustmentBehavior="never"
                            contentContainerStyle={styles.listContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.cards}>
                                    {accounts.length > 0 ? (
                                        <EMoneyCard
                                            withBonuses
                                            color={theme.colors.button}
                                            footer={accounts[0].number}
                                            amount={accounts[0].balance || 0}
                                            bonuses={accounts[0].points || 0}
                                            currency={accounts[0].currency || ''}
                                            onPress={() => this.onPressAccount(accounts[0])}
                                        />
                                    ) : null}
                                    <View style={styles.cardsTable}>
                                        {accounts.length > 0
                                            ? accounts.map((account: Account, index: number) =>
                                                  index > 0 ? (
                                                      <View key={account.number} style={styles.cardCell}>
                                                          <EMoneyCard
                                                              withOutLogo
                                                              bonuses={0}
                                                              color="#6C6C6C"
                                                              amountFontSize={22}
                                                              subtitle={account.number}
                                                              amount={account.balance || 0}
                                                              footer={`Бонусы: ${currency(
                                                                  account.points,
                                                                  account.currency,
                                                              ).format(true)}`}
                                                              currency={account.currency || ''}
                                                              style={{flex: 1, aspectRatio: undefined}}
                                                              onPress={() => this.onPressAccount(account)}
                                                          />
                                                      </View>
                                                  ) : null,
                                              )
                                            : null}
                                        {hasAddAccount ? (
                                            <View style={styles.cardCell}>
                                                <Button
                                                    variant="uncontained"
                                                    alignContent="center"
                                                    style={styles.addAccount}
                                                    onPress={this.onPressAddAccount}>
                                                    <PlusIcon />
                                                    <Typography style={{marginTop: 8}}>
                                                        {i18n.t('cards.addAccount')}
                                                    </Typography>
                                                </Button>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                                {/*
                                <View style={styles.section}>
                                    <Typography variant="title">{i18n.t('cards.externalCards')}</Typography>
                                </View>
                                <Button
                                    variant="uncontained"
                                    alignContent="center"
                                    style={styles.addExternalCard}
                                    tintColor={theme.colors.primaryText}>
                                    <Typography style={{marginRight: 8}}>{i18n.t('cards.addExternalCard')}</Typography>
                                    <PlusIcon fill={theme.colors.primaryText} width={10} height={10} />
                                </Button>
                                */}
                            </View>
                            {_.values(advertising)
                                .sort(compareFnByIndex)
                                .map((group: any) => (
                                    <AdvertisingGroup
                                        isParentTabs={true}
                                        key={`ag.${group.id}`}
                                        componentId={componentId}
                                        contentContainerStyle={styles.advertisingGroup}
                                        {...group}
                                    />
                                ))}
                        </Animated.ScrollView>
                        <NavBar
                            withFillAnimation
                            translucentStatusBar
                            useHardwareBackHandler
                            style={styles.fixedNavBar}
                            withBottomBorder="animated"
                            onPressBack={this.onPressClose}
                            title={i18n.t('tabs.cards')}
                            scrollY={overlapScreenScrollValue(this.scrollY)}
                        />
                    </>
                )}
            </View>
        );
    }
}

export const navigationName = 'app.CardsTab';
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

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => {
    const sectionType = R.pathOr(0, ['type'], ownerProps);
    return {
        hasAuthClient: ReduxUtils.hasAuthClient(state),
        accounts: (state.client.info || {}).accounts || emptyArray,
        advertising: (state.advertising || emptyObject)[sectionType] || emptyObject,
        hasAddAccount:
            _.values(state.availableCurrencies).reduce((res: number, c: any) => res + (c.isAccount ? 0 : 1), 0) > 0,
    };
})(withTheme(CardsTabScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
