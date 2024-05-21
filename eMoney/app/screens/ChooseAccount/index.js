// @flow
import React from 'react';
import {connect} from 'react-redux';
import {doneByPromise} from '../../utils';
import type {Account} from '../../constants';
import type {ReduxState} from '../../reducers';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import {Containers, Typography} from '../../components';
import {BOTTOM_SPACE, emptyArray, NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';
import {Keyboard, Platform, Image as RNImage, Dimensions, FlatList, TouchableOpacity, View} from 'react-native';

import i18n from '../../i18n';
import currency from '../../currency';

import getStyles, {ITEM_HEIGHT} from './styles';

import ServiceLogo from '../../resources/svg/logo.svg';

export type Props = {
    onChoose?: (account: Account) => any,
    onClose?: () => any,
    accounts: Account[],
    account?: Account,
    componentId: any,
    theme: Theme,
    styles: any,
};

class ChooseAccountScreen extends React.PureComponent<Props> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;

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

    onPressAccount = (account: Account) => {
        this.props.onChoose && this.props.onChoose(account);
        return this.onPressClose();
    };

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

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    renderItem = ({item, index}) => (
        <TouchableOpacity style={this.props.styles.item} activeOpacity={0.62} onPress={() => this.onPressAccount(item)}>
            <View style={{flex: 1, paddingTop: 4}}>
                <View style={this.props.styles.accountNumberBlock}>
                    <ServiceLogo
                        width={10}
                        height={10}
                        style={{marginRight: 8}}
                        fill={this.props.theme.colors.button}
                    />
                    <Typography fontSize={12} variant="body1" numberOfLines={1}>
                        {item ? item.number : ''}
                    </Typography>
                </View>
                <Typography fontSize={28} fontWeight="400" numberOfLines={1} variant="display1">
                    {item ? currency(item.balance, item.currency).format(true) : ''}
                </Typography>
            </View>
            {this.props.account && this.props.account.number === item.number ? (
                <View style={this.props.styles.indicatorBlock}>
                    <RNImage
                        style={this.props.styles.indicator}
                        resizeMode="contain"
                        source={require('../../resources/icons/ic-success-operation.png')}
                    />
                </View>
            ) : (
                <View style={{width: 20}} />
            )}
            {index < this.props.accounts.length - 1 ? <View style={this.props.styles.separator} /> : null}
        </TouchableOpacity>
    );

    render() {
        const {styles, accounts} = this.props;
        const maxHeight = Dimensions.get('window').height - BOTTOM_SPACE - STATUS_BAR_HEIGHT - NAV_BAR_HEIGHT - 10;
        return (
            <Containers.BPS
                styles={styles.bps}
                useHardwareBackHandler
                testID="choose-account"
                ref={this.onBottomPanelRef}
                onPressBackdrop={this.onPressClose}>
                <View style={styles.header}>
                    <Typography style={{flex: 1}} variant="subheading" color="primary" align="left">
                        {i18n.t('chooseAccount.title')}
                    </Typography>
                </View>
                <FlatList
                    data={accounts}
                    renderItem={this.renderItem}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(item) => item.number}
                    style={{alignSelf: 'stretch', height: Math.min(maxHeight, accounts.length * ITEM_HEIGHT)}}
                    getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index})}
                />
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.ChooseAccount';
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
const reduxConnector = connect((state: ReduxState, ownerProps: any) => {
    const accounts = (state.client.info || {}).accounts || emptyArray;
    const sortNumber = (ownerProps.account || {}).number;
    return {
        accounts:
            accounts.length > 1 && sortNumber
                ? accounts.sort((a: Account, b: Account) => {
                      if (a.number === sortNumber) {
                          return b.number === sortNumber ? 0 : -1;
                      }
                      return b.number === sortNumber ? 1 : 0;
                  })
                : accounts,
    };
})(withTheme(ChooseAccountScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
