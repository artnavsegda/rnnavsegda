// @flow
import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {NavBar, Button, Typography, Image} from '../../components';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {compareFnByInvertedIndex, overlapScreenScrollValue} from '../../utils';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {API_HISTORY_GET_ITEMS, STATUS_BAR_HEIGHT, type HistoryItem} from '../../constants';
import {View, Dimensions, InteractionManager, Animated, ActivityIndicator} from 'react-native';

import currency from '../../currency';
import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    items: {[id: number]: HistoryItem},
    isModal?: boolean,
    fetching: boolean,
    language: string,
    componentId: any,
    familyId: number,
    lastId: number,
    theme: Theme,
    styles: any,
};

type State = {
    items: {[id: number]: HistoryItem},
    dataProvider: DataProvider,
    searchText: string,
    groupType: number,
};

class HistoryTabScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (props.items !== state.items) {
            return {
                items: props.items,
                dataProvider: state.dataProvider.cloneWithRows(_.values(props.items).sort(compareFnByInvertedIndex)),
            };
        }
        return null;
    }
    subscriptions: any[] = [];
    static timeBlockHeight: number = 36;
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    layoutProvider: LayoutProvider = new LayoutProvider(
        (index: number) =>
            this.state.groupType > 0 && !this._isVisibleByIndex(index) ? -1 : this._hasTimeBlockForIndex(index) ? 1 : 0,
        (type: number, dim: any, index: number) => {
            if (type < 0) {
                dim.height = 0;
                dim.width = 0;
                return;
            }
            dim.height = 64 + (type >= 1 ? HistoryTabScreen.timeBlockHeight : 0);
            dim.width = Dimensions.get('window').width;
        },
    );
    mounted: boolean = false;
    lastDI: number = 0;
    state: State = {
        dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]),
        searchText: '',
        groupType: 0,
        items: {},
    };

    componentDidMount() {
        this.mounted = true;
        this.subscriptions = [Navigation.events().bindComponent(this)];
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription: any) => subscription.remove());
        this.mounted = false;
    }

    componentDidAppear() {
        InteractionManager.runAfterInteractions(() => doing.api.history.getRequest().start());
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.language !== prevProps.language) {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    text: i18n.t('tabs.history'),
                },
            });
        }
    }

    onChangeGroupType = (index: number) => {
        this.lastDI = 0;
        this.mounted && this.setState({groupType: index});
    };

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
        {useNativeDriver: false},
    );

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        /*
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });*/
        return Navigation.pop(this.props.componentId);
    };

    _hasTimeBlockForIndex = (index: number): boolean => {
        const {price, date} = this.state.dataProvider.getDataForIndex(index) || {date: 0};
        const di = Math.ceil(date / 86400000);
        if (index <= 0 || this.state.dataProvider.getSize() < 2) {
            this.lastDI = di;
            return true;
        }
        const {price: prevPrice, date: prevDate} = this.state.dataProvider.getDataForIndex(index - 1) || {date: 0};
        if (di !== Math.ceil(prevDate / 86400000)) {
            this.lastDI = di;
            return true;
        }
        if (this.state.groupType > 0 && Math.max(-1, Math.min(1, prevPrice)) !== Math.max(-1, Math.min(1, price))) {
            if (this.lastDI !== di) {
                this.lastDI = di;
                return true;
            }
        }
        return false;
    };

    _isVisibleByIndex = (index: number): boolean => {
        const {price} = this.state.dataProvider.getDataForIndex(index) || {price: 0};
        return !((this.state.groupType === 1 && price >= 0) || (this.state.groupType === 2 && price < 0));
    };

    renderSign = (status) => {
        switch(status) {

            case 0:
                return "Успех"
            break;

            case 1:
                return "Оформление"
            break;

            case 2:
                return "Ожидание"
            break;

            case 3:
                return "Требуется подтверждение"
            break;

            case 4:
                return "Ошибка"
            break;
        }
    }

    rowRenderer = (type: number, data: any | HistoryItem) =>
        type >= 0 ? (
            <View style={{flex: 1}}>
                {type === 1 ? (
                    <View style={this.props.styles.timeBlock}>
                        <Typography variant="title">
                            {Moment(data.date).calendar(null, {
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
                    {data.picture ? (
                        <Image
                            resizeMode="contain"
                            svgContentScale={1}
                            source={doing.api.files.sourceBy(data)}
                            style={[
                                this.props.styles.historyItemImage,
                                data.colorPicture
                                    ? {
                                          backgroundColor: data.colorPicture,
                                      }
                                    : undefined,
                            ]}
                        />
                    ) : (
                        <View style={this.props.styles.historyItemLeftSpacer} />
                    )}
                    <View style={{flex: 1, paddingRight: 12}}>
                        <Typography style={{width: '100%'}} variant="subheading" fontSize={15} numberOfLines={1}>
                            {data.name || 'Unknown'}
                        </Typography>

                        {
                            console.log(data)
                        }

                        <Typography
                            fontSize={11}
                            variant="body1"
                            color="secondary"
                            numberOfLines={1}
                            style={{width: '100%'}}>
                            {data.description || [data.account, data.client2Name].filter((a) => !!a).join(', ')}
                        </Typography>
                        <Typography
                            fontSize={11}
                            variant="body1"
                            color="secondary"
                            numberOfLines={1}
                            style={{width: '100%'}}>
                            {

                                this.renderSign(data.status)

                            }
                        </Typography>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Typography
                            fontSize={15}
                            numberOfLines={1}
                            variant="subheading"
                            color={data.status == 4 ? '#f00' : (data.price > 0 ? 'success' : 'primary')}>
                            {currency(data.price, data.currencyAlfa3).format(true)}
                        </Typography>
                        {data.bonusSpend !== 0 ? (
                            <Typography variant="body1" color="warning" fontSize={11} numberOfLines={1}>
                                -{data.bonusSpend} бонусов
                            </Typography>
                        ) : null}
                        {data.bonusReceived !== 0 ? (
                            <Typography variant="body1" color="success" fontSize={11} numberOfLines={1}>
                                +{data.bonusReceived} бонусов
                            </Typography>
                        ) : null}
                    </View>
                </Button>
            </View>
        ) : null;

    render() {
        const {styles, theme, fetching} = this.props;
        return (
            <View testID="history-tab" style={styles.container}>
                {this.state.dataProvider.getSize() > 0 ? (
                    <RecyclerListView
                        onScroll={this.onScroll}
                        rowRenderer={this.rowRenderer}
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.state.dataProvider}
                        style={{flex: 1, minWidth: 1, minHeight: 1}}
                        scrollViewProps={{
                            removeClippedSubviews: false,
                            directionalLockEnabled: true,
                            contentInsetAdjustmentBehavior: 'never',
                            automaticallyAdjustContentInsets: false,
                            contentContainerStyle: styles.listContentContainer,
                        }}
                    />
                ) : (
                    <View style={{flex: 1}} />
                )}
                {/* Render navbar */}
                <NavBar
                    showBackButton
                    withFillAnimation
                    translucentStatusBar
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('tabs.history')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
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
                    }>
                    <View style={styles.toolbar}>
                        <SegmentedControlTab
                            {...styles.segmentedControl}
                            values={[
                                i18n.t('history.segments.all'),
                                i18n.t('history.segments.out'),
                                i18n.t('history.segments.in'),
                            ]}
                            selectedIndex={this.state.groupType}
                            onTabPress={this.onChangeGroupType}
                        />
                    </View>
                </NavBar>
            </View>
        );
    }
}

export const navigationName = 'app.HistoryTab';
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    ...state.history,
    fetching: ReduxUtils.hasFetching(state, [API_HISTORY_GET_ITEMS]),
}))(withTheme(HistoryTabScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
