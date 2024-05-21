// @flow
import React from 'react';
import {View, InteractionManager, Animated, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import {connect} from 'react-redux';
import Moment from 'moment';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {NavBar, Typography, Button, Image} from '../../components';
import {Navigation} from 'react-native-navigation';
import {
    API_NOTIFICATIONS_PUSH_LIST,
    API_NOTIFICATIONS_BONUSES_LIST,
    API_NOTIFICATIONS_PAYMENTS_LIST,
} from '../../constants';
import {show} from './NotificationModal';
import {withTheme, statusBarStyleGetter, type Theme} from '../../themes';
import Confirmation from '../Confirmation';

import doing from '../../doing';

import getStyles from './styles';
import i18n from '../../i18n';
import currency from '../../currency';
import {getMessage} from '../../utils';

const FETCHING_PAGE_SIZE = 100;

export type Props = {
    isParentTabs?: boolean,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    cancelInvoiceOperation: boolean,
    payInvoiceOperation: boolean,
    currentInvoiceID: number,
};

class NotificationListScreen extends React.PureComponent<Props> {
    mounted: boolean = false;

    state: State = {
        cancelInvoiceOperation: false,
        payInvoiceOperation: false,
        currentInvoiceID: -1,
    };

    componentDidMount() {
        this.mounted = true;
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    onPressClose = () => {
        doing.app.notifications.clearPushHistory();
        return Navigation.dismissModal(this.props.componentId);
    };

    componentDidAppear() {
        this.fetchData();
    }

    /*  onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    }; */

    payInvoice = (id) => {
        this.mounted &&
            this.setState({payInvoiceOperation: true, currentInvoiceID: id}, () => {
                doing.api.invoice
                    .confirmPayInvoice(id, '0000')
                    .error((error: any) => {
                        this.mounted && this.setState({payInvoiceOperation: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .success((data: any) => {
                        this.mounted && this.setState({payInvoiceOperation: false});
                        this.fetchData();
                    })
                    .start();
            });
    };

    cancelPayInvoice = (id) => {
        this.mounted &&
            this.setState({cancelInvoiceOperation: true, currentInvoiceID: id}, () => {
                doing.api.invoice
                    .cancelPayInvoice(id)
                    .error((error: any) => {
                        this.mounted && this.setState({cancelInvoiceOperation: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .success((data: any) => {
                        this.mounted && this.setState({cancelInvoiceOperation: false});
                        this.fetchData();
                    })
                    .start();
            });
    };

    fetchData = () => {
        const {type} = this.props;
        if (type === 0 || type === 3) {
            InteractionManager.runAfterInteractions(() =>
                doing.api.notifications.getPushHistory(type, 1, FETCHING_PAGE_SIZE).start(),
            );
        } else if (type === 1) {
            InteractionManager.runAfterInteractions(() => doing.api.notifications.getPaymentsHistory().start());
        } else if (type === 2) {
            InteractionManager.runAfterInteractions(() => doing.api.notifications.getBonusesHistory().start());
        }
    };

    onRefresh = () => {
        this.fetchData();
    };

    openNotification = (item) => {
        const {type} = this.props;
        // show
        show({item: item, type});
    };

    renderSeparatorSection = () => {
        return <View style={{marginVertical: 8}} />;
    };

    renderInvoice = (item: any) => {
        const {cancelInvoiceOperation, payInvoiceOperation, currentInvoiceID} = this.state;
        const {styles} = this.props;

        const notPaidInvoice = item.type === 6;
        return (
            <View style={{}}>
                <View style={styles.invoiceContainer}>
                    {item.picture ? (
                        <Image
                            resizeMode="contain"
                            svgContentScale={1}
                            source={doing.api.files.sourceBy(item)}
                            style={[
                                this.props.styles.historyItemImage,
                                item.colorPicture
                                    ? {
                                          backgroundColor: item.colorPicture,
                                      }
                                    : undefined,
                            ]}
                        />
                    ) : (
                        <View style={this.props.styles.historyItemLeftSpacer} />
                    )}
                    <View style={styles.invoiceDataContainer}>
                        <Typography variant="subheading" numberOfLines={3} color="primary">
                            {item.name}
                        </Typography>
                        <Typography variant="display1" color="primary" style={{marginTop: 16}}>
                            {currency(item.price, item.currencyAlfa3).format(true)}
                        </Typography>
                        <View style={styles.invoiceDateContainer}>
                            {!notPaidInvoice && <Button variant="link">Смотреть чек</Button>}
                            <Typography variant="body1" style={{fontSize: 12}} color={'#919191'}>
                                {Moment(item.date).calendar(null, {
                                    sameDay: i18n.t('calendar.sameDay'),
                                    nextDay: i18n.t('calendar.nextDay'),
                                    lastDay: i18n.t('calendar.lastDay'),
                                    sameElse: 'D MMMM YYYY',
                                    nextWeek: 'dddd',
                                })}
                            </Typography>
                        </View>
                    </View>
                </View>
                {notPaidInvoice && (
                    <View style={styles.invoiceActionContainer}>
                        <Button
                            disabled={cancelInvoiceOperation || payInvoiceOperation}
                            loading={currentInvoiceID === item.id && payInvoiceOperation}
                            variant="contained"
                            onPress={() => this.payInvoice(item.id)}>
                            Оплатить
                        </Button>
                        <Button
                            disabled={payInvoiceOperation || cancelInvoiceOperation}
                            loading={currentInvoiceID === item.id && cancelInvoiceOperation}
                            variant="contained"
                            onPress={() => this.cancelPayInvoice(item.id)}>
                            Пропустить
                        </Button>
                    </View>
                )}
            </View>
        );
    };

    renderNotification = ({item}) => {
        const {styles, type} = this.props;
        if (type === 0 || type === 3) {
            return (
                <TouchableOpacity disabled={type === 3} onPress={() => this.openNotification(item)}>
                    <View style={styles.notificationContainer}>
                        <View style={styles.notificationContainerInfoBlock}>
                            <Typography variant="subheading" numberOfLines={1}>
                                {item.title}
                            </Typography>
                            <Typography variant="body1" numberOfLines={2} color="secondary">
                                {item.body || ''}
                            </Typography>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        if (type === 1 && item.type === 6) {
            return this.renderInvoice(item);
        }

        return (
            <View style={{flex: 1}}>
                {type === 1 ? (
                    <View style={this.props.styles.timeBlock}>
                        <Typography variant="title">
                            {Moment(item.date).calendar(null, {
                                sameDay: i18n.t('calendar.sameDay'),
                                nextDay: i18n.t('calendar.nextDay'),
                                lastDay: i18n.t('calendar.lastDay'),
                                sameElse: 'D MMMM YYYY',
                                nextWeek: 'dddd',
                            })}
                        </Typography>
                    </View>
                ) : null}
                <Button style={this.props.styles.historyItem} variant="action">
                    {item.picture ? (
                        <Image
                            resizeMode="contain"
                            svgContentScale={1}
                            source={doing.api.files.sourceBy(item)}
                            style={[
                                this.props.styles.historyItemImage,
                                item.colorPicture
                                    ? {
                                          backgroundColor: item.colorPicture,
                                      }
                                    : undefined,
                            ]}
                        />
                    ) : (
                        <View style={this.props.styles.historyItemLeftSpacer} />
                    )}
                    <View style={{flex: 1, paddingRight: 12}}>
                        <Typography style={{width: '100%'}} variant="subheading" numberOfLines={1}>
                            {item.name || item.title}
                        </Typography>
                        <Typography
                            fontSize={11}
                            variant="body1"
                            color="secondary"
                            numberOfLines={1}
                            style={{width: '100%'}}>
                            {item.description || [item.account, item.client2Name].filter((a) => !!a).join(', ')}
                        </Typography>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Typography
                            fontSize={15}
                            numberOfLines={1}
                            variant="subheading"
                            color={item.price > 0 ? 'success' : 'primary'}>
                            {currency(item.price, item.currencyAlfa3).format(true)}
                        </Typography>
                        {item.bonusSpend !== 0 ? (
                            <Typography variant="body1" color="warning" fontSize={11} numberOfLines={1}>
                                -{item.bonusSpend} бонусов
                            </Typography>
                        ) : null}
                        {item.bonusReceived !== 0 ? (
                            <Typography variant="body1" color="success" fontSize={11} numberOfLines={1}>
                                +{item.bonusReceived} бонусов
                            </Typography>
                        ) : null}
                    </View>
                </Button>
            </View>
        );
    };

    render() {
        const {styles, title, fetching, historyNotifications, theme} = this.props;
        return (
            <View testID="list" style={styles.container}>
                <NavBar
                    useSafeArea
                    variant="transparent"
                    title={title}
                    showBackButton="close"
                    translucentStatusBar="adaptive"
                    onPressBack={this.onPressClose}
                    color={this.props.theme.colors.buttonCaption}
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
                    data={historyNotifications}
                    extraData={historyNotifications.slice()}
                    renderItem={this.renderNotification}
                    refreshing={false}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`)}
                    ItemSeparatorComponent={this.renderSeparatorSection}
                />
            </View>
        );
    }
}

export const navigationName = 'app.NotificationListScreen';
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
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    historyNotifications: state.pushNotifications.historyNotifications,
    fetching: ReduxUtils.hasFetching(state, [
        API_NOTIFICATIONS_PUSH_LIST,
        API_NOTIFICATIONS_BONUSES_LIST,
        API_NOTIFICATIONS_PAYMENTS_LIST,
    ]),
}))(withTheme(NotificationListScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
