// @flow
import React from 'react';
import {View, InteractionManager, Text, Animated, TouchableOpacity, ActivityIndicator} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import * as R from 'ramda';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {NavBar, Button, Typography, Image} from '../../components';
import {getNC as getNotificationsListNC} from './NotificationList';
import {Navigation} from 'react-native-navigation';
import {withTheme, statusBarStyleGetter, type Theme} from '../../themes';
import {API_NOTIFICATIONS_GET_TOP} from '../../constants';

import EventIcon from '../../resources/svg/eventNotification.svg';
import BonusIcon from '../../resources/svg/bonusNotification.svg';
import PaymentIcon from '../../resources/svg/paymentsNotification.svg';
import SecurityIcon from '../../resources/svg/securityNotification.svg';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    isParentTabs?: boolean,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

class NotificationsHistoryScreen extends React.PureComponent<Props> {
    navigationEventListener: any = null;

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear() {
        InteractionManager.runAfterInteractions(() => doing.api.notifications.getRequest().start());
    }

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onRefresh = () => {
        InteractionManager.runAfterInteractions(() => doing.api.notifications.getRequest().start());
    };

    getSectionInfo = (sectionType: 0) => {
        switch (sectionType) {
            case 0:
                return {
                    Icon: EventIcon,
                    title: i18n.t('notificationsHistory.sections.events'),
                };
            case 1:
                return {
                    Icon: PaymentIcon,
                    title: i18n.t('notificationsHistory.sections.payments'),
                };
            case 2:
                return {
                    Icon: BonusIcon,
                    title: i18n.t('notificationsHistory.sections.bonuses'),
                };
            case 3:
                return {
                    Icon: SecurityIcon,
                    title: i18n.t('notificationsHistory.sections.security'),
                };
            default:
                return {
                    Icon: EventIcon,
                    title: i18n.t('notificationsHistory.sections.events'),
                };
        }
    };

    openNotificationSection = (item) => {
        const sectionInfo = this.getSectionInfo(item.type);
        InteractionManager.runAfterInteractions(() =>
            Navigation.showModal(
                getNotificationsListNC({
                    type: item.type,
                    title: sectionInfo.title,
                }),
            ),
        );
    };

    renderNotificationSectionItem = ({item}) => {
        const {styles} = this.props;
        // get info
        const sectionInfo = this.getSectionInfo(item.type);
        // get icon
        const {Icon} = sectionInfo;
        return (
            <TouchableOpacity onPress={() => this.openNotificationSection(item)}>
                <View style={styles.sectionContainer}>
                    <Icon />
                    <View style={styles.infoContainer}>
                        <Text style={styles.sectionHeaderText}>{sectionInfo.title}</Text>
                        <Typography numberOfLines={3} variant="body1" style={styles.sectionSubheaderText}>
                            {item.lastMessage}
                        </Typography>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={styles.dateText}>{moment(item.lastDate).format('DD MMM')}</Text>
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{item.quantity}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    renderSeparatorSection = () => {
        return <View style={{marginVertical: 16}} />;
    };

    render() {
        const {styles, fetching, theme, notificationHistoryGroups} = this.props;
        return (
            <View testID="template" style={styles.container}>
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    translucentStatusBar={true}
                    title={i18n.t('notificationsHistory.header')}
                    rightItems={
                        fetching
                            ? [
                                  {
                                      view: (
                                          <ActivityIndicator color={theme.colors.primaryText} size="small" animating />
                                      ),
                                  },
                              ]
                            : undefined
                    }
                />
                <Animated.FlatList
                    contentContainerStyle={styles.sectionListContainer}
                    data={notificationHistoryGroups}
                    extraData={notificationHistoryGroups.slice()}
                    renderItem={this.renderNotificationSectionItem}
                    refreshing={fetching}
                    onRefresh={this.onRefresh}
                    refreshControl={null}
                    ItemSeparatorComponent={this.renderSeparatorSection}
                    keyExtractor={(item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`)}
                />
            </View>
        );
    }
}

export const navigationName = 'app.NotificationsHistoryScreen';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
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
                bottomTabs: {
                    visible: false,
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    fetching: ReduxUtils.hasFetching(state, [API_NOTIFICATIONS_GET_TOP]),
    notificationHistoryGroups: R.pathOr([], ['pushNotifications', 'notificationHistoryGroups'], state),
}))(withTheme(NotificationsHistoryScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
