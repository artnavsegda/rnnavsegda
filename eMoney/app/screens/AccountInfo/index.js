// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Animated, View} from 'react-native';
import type {ReduxState} from '../../reducers';
import {getState} from '../../doing/store';
import {Navigation} from 'react-native-navigation';
import {compareFnByIndex, overlapScreenScrollValue} from '../../utils';
import {type Account, emptyObject, STATUS_BAR_HEIGHT} from '../../constants';
import {NavBar, Typography, Button, EMoneyCard, AdvertisingGroup} from '../../components';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';

import {getNC as getLocalTransferFormNC} from '../Services/LocalTransferForm';
// import {getNC as getReplenishFormNC} from '../Services/ReplenishForm';
import {getNC as getAccountDetailsNC} from '../AccountDetails';

import Services from '../Services';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    isParentTabs?: boolean,
    isModal?: boolean,
    advertising: any,
    componentId: any,
    account: Account,
    theme: Theme,
    styles: any,
};

type InternalProps = Props & {
    transferBlocks: any,
};

import ShopIcon from '../../resources/svg/shop.svg';
import ScanQrIcon from '../../resources/svg/scan-qr.svg';
import AddCardIcon from '../../resources/svg/add-card.svg';
import PlusMoneyIcon from '../../resources/svg/plus-money.svg';
import TransferToIcon from '../../resources/svg/transfer-to.svg';
import TransferBetweenIcon from '../../resources/svg/transfer-between.svg';

class AccountInfoScreen extends React.PureComponent<InternalProps> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);

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

    onPressReplanish = () => {
        const block = _.first(_.values(getState().services.blocks[5]));
        //const block = _.first(_.values(this.props.transferBlocks));
        if (!block) {
            return;
        }
        return Services.open(
            this.props.componentId,
            {block},
            {
                isParentTabs: this.props.isParentTabs,
            },
        );
        /*
        return Navigation.push(
            this.props.componentId,
            getReplenishFormNC({
                isParentTabs: this.props.isParentTabs,
                account: this.props.account,
            }),
        );*/
    };

    onPressLocalTransfer = () => {
        return Navigation.push(
            this.props.componentId,
            getLocalTransferFormNC({
                isParentTabs: this.props.isParentTabs,
                account: this.props.account,
            }),
        );
    };

    onPressDetails = () => {
        return Navigation.push(
            this.props.componentId,
            getAccountDetailsNC(this.props.account, {
                isParentTabs: this.props.isParentTabs,
            }),
        );
    };

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    renderButton = (title: string, icon?: any, onPress?: () => any) => (
        <Button size="small" style={this.props.styles.action} variant="action" onPress={onPress}>
            <View style={this.props.styles.actionInfo}>
                {icon ? <View style={this.props.styles.actionIcon}>{icon}</View> : icon}
                <Typography style={{width: '100%'}} variant="subheading">
                    {title}
                </Typography>
            </View>
        </Button>
    );

    render() {
        const {styles, theme, account, componentId, advertising, isModal} = this.props;
        return (
            <View testID="account-info" style={styles.container}>
                <Animated.ScrollView
                    style={styles.list}
                    removeClippedSubviews
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}>
                    <View style={styles.content}>
                        <Typography paragraph variant="title" fontSize={24} fontWeight="500">
                            {account.number}
                        </Typography>
                        <EMoneyCard amount={account.balance} color={theme.colors.button} currency={account.currency} />
                    </View>
                    {this.renderButton(
                        i18n.t('accountInfo.append'),
                        <PlusMoneyIcon fill={theme.colors.button} />,
                        this.onPressReplanish,
                    )}
                    {this.renderButton(
                        i18n.t('accountInfo.transferBetween'),
                        <TransferBetweenIcon fill={theme.colors.button} />,
                        this.onPressLocalTransfer,
                    )}
                    {this.renderButton(i18n.t('accountInfo.toAsk'), <AddCardIcon fill={theme.colors.button} />)}
                    {this.renderButton(
                        i18n.t('accountInfo.details'),
                        <ScanQrIcon fill={theme.colors.button} />,
                        this.onPressDetails,
                    )}
                    <View style={styles.content} />
                    <View style={styles.content}>
                        <EMoneyCard
                            color="#C98D28"
                            subtitle="Bonus"
                            textColor="#FFF"
                            amount={account.points}
                            currency={account.currency}
                        />
                    </View>
                    {account.points > 0 ? (
                        <>
                            {this.renderButton(
                                i18n.t('accountInfo.translateToMaster'),
                                <TransferToIcon fill={theme.colors.bonuses} />,
                            )}
                            {this.renderButton(
                                i18n.t('accountInfo.payInShop'),
                                <ShopIcon fill={theme.colors.bonuses} />,
                            )}
                            <View style={styles.content} />
                        </>
                    ) : null}
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
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('accountInfo.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
            </View>
        );
    }
}

export const navigationName = 'app.AccountInfo';
export function getNC(account: Account, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                account,
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
    account:
        ((state.client.info || {}).accounts || []).find((a: Account) => a.number === ownerProps.account.number) ||
        ownerProps.account,
    advertising: (state.advertising || emptyObject)[3] || emptyObject,
    transferBlocks: state.services.blocks[2] || {},
}))(withTheme(AccountInfoScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
