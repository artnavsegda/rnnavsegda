// @flow
import React from 'react';
import {connect} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import type {ReduxState} from '../../reducers';
import {Navigation} from 'react-native-navigation';
import {overlapScreenScrollValue} from '../../utils';
import {NavBar, Typography} from '../../components';
import {Animated, Share, View} from 'react-native';
import {type Account, MIN_SCREEN_SIZE, STATUS_BAR_HEIGHT} from '../../constants';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    isParentTabs?: boolean,
    isModal?: boolean,
    componentId: any,
    account: Account,
    client: any,
    theme: Theme,
    styles: any,
};

class AccountDetailsScreen extends React.PureComponent<Props> {
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

    onPressExport = () => {
        const {client, account} = this.props;
        if (!client || !account) {
            return;
        }
        return Share.share({
            title: i18n.t('accountDetails.title'),
            message:
                `${i18n.t('accountDetails.shareMessageTitle')}\r\n` +
                '---------------------\r\n' +
                `${i18n.t('accountDetails.accountNumber')}: ${account.number}\r\n` +
                `${i18n.t('accountDetails.accountCurrency')}: ${account.currency}\r\n` +
                `${i18n.t('accountDetails.recipient')}: ${client.name}`,
        });
    };

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    render() {
        const {styles, theme, client, account, isModal} = this.props;
        return (
            <View testID="account-details" style={styles.container}>
                <Animated.ScrollView
                    style={styles.list}
                    removeClippedSubviews
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}>
                    {account && client && (client.clientGuid || '').length > 4 ? (
                        <View style={styles.content}>
                            <View style={{alignItems: 'flex-start'}}>
                                <View style={{padding: 8, borderRadius: 8, backgroundColor: '#fff'}}>
                                    <QRCode
                                        color="#000"
                                        backgroundColor="rgba(0,0,0,0)"
                                        size={MIN_SCREEN_SIZE * 0.6 - 40}
                                        value={`${client.clientGuid}.${account.number}`}
                                    />
                                </View>
                            </View>
                            <View style={{height: 20}} />
                            <Typography paragraph variant="body1">
                                <Typography variant="body1" fontWeight="bold">
                                    {i18n.t('accountDetails.accountNumber')}:{' '}
                                </Typography>
                                {account.number || 'EM###########'}
                            </Typography>
                            <Typography paragraph variant="body1">
                                <Typography variant="body1" fontWeight="bold">
                                    {i18n.t('accountDetails.accountCurrency')}:{' '}
                                </Typography>
                                {(account.currency || '').toUpperCase()}
                            </Typography>
                            <Typography paragraph variant="body1">
                                <Typography variant="body1" fontWeight="bold">
                                    {i18n.t('accountDetails.recipient')}:{' '}
                                </Typography>
                                {client.name || '-'}
                            </Typography>
                        </View>
                    ) : null}
                </Animated.ScrollView>
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('accountDetails.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                    rightItems={[
                        {
                            iconSource: require('../../resources/icons/ic-export.png'),
                            onPress: this.onPressExport,
                        },
                    ]}
                />
            </View>
        );
    }
}

export const navigationName = 'app.AccountDetails';
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
    account: ownerProps.account
        ? ((state.client.info || {}).accounts || []).find((a: Account) => a.number === ownerProps.account.number) ||
          ownerProps.account
        : ownerProps.account,
    client: state.client.info,
}))(withTheme(AccountDetailsScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
