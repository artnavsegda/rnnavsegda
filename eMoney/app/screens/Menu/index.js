// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {View, Animated} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {STATUS_BAR_HEIGHT, type Partition} from '../../constants';
import {compareFnByIndex, overlapScreenScrollValue} from '../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {NavBar, Button, Widget, Accessory, Typography} from '../../components';

import {getNC as getAboutAppServiceNC} from '../AboutAppService';
import {getNC as getSupportChatNC} from '../SupportChat';
import {getNC as getSettingsNC} from '../Settings';
import {getNC as getFaqNC} from '../Faq';

import Partitions from '../Partitions';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    componentId: any,
    isModal?: boolean,
    language: string,
    sections: any[],
    theme: Theme,
    styles: any,
};

const Operations = {
    aboutService: -1,
    profileSettings: -2,
    support: -3,
    faq: -4,
};

class MenuTabScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    subscriptions: any[] = [];

    componentDidMount() {
        this.subscriptions = [Navigation.events().bindComponent(this)];
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription: any) => subscription.remove());
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.language !== prevProps.language) {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    text: i18n.t('tabs.menu'),
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

    onPressPartition = (partition: Partition) => {
        console.log('Partition', partition);
        Partitions.open(this.props.componentId, partition);
    };

    onPressNotifications = () => {};
    //    InteractionManager.runAfterInteractions(() =>
    //        Navigation.showModal(
    //            getNotificationsHistoryNC({
    //                familyId: this.props.familyId,
    //                theme: this.props.theme,
    //           }),
    //       ),
    //   );

    onPressChangeTheme = () => doing.theme.change();

    onPressOperation = (op: number) => {
        switch (op) {
            case Operations.profileSettings:
                return Navigation.push(
                    this.props.componentId,
                    getSettingsNC({
                        isParentTabs: true,
                    }),
                );
            case Operations.aboutService:
                return Navigation.push(
                    this.props.componentId,
                    getAboutAppServiceNC({
                        isParentTabs: true,
                    }),
                );
            case Operations.support:
                return Navigation.push(
                    this.props.componentId,
                    getSupportChatNC({
                        isParentTabs: true,
                    }),
                );
            case Operations.faq:
                return Navigation.push(
                    this.props.componentId,
                    getFaqNC({
                        isParentTabs: true,
                    }),
                );
            default:
                return;
        }
    };

    keyExtractor = (item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`);

    renderSectionHeader = ({section}) => (
        <View style={this.props.styles.section}>
            <Typography variant="title">{i18n.t(section.title)}</Typography>
        </View>
    );

    renderFooter = () => {
        const {themeName, styles} = this.props;
        return (
            <View>
                <View style={styles.section}>
                    <Typography variant="title">{i18n.t('settings.theme')}</Typography>
                </View>
                <Button variant="link" style={styles.link} onPress={this.onPressChangeTheme}>
                    {i18n.t(`settings.moveFrom${_.upperFirst(themeName)}Theme`)}
                </Button>
            </View>
        );
    };

    renderSectionFooter = () => {
        const {styles} = this.props;
        return <View style={styles.footer} />;
    };

    renderItem = ({item, section}) => {
        const {themeName, client} = this.props;
        if (!section) {
            return null;
        }

        const haveBadge = client.invoices > 0 && item.code === 'notifications' ? true : false;

        if (section.type === 1) {
            return (
                <Button
                    variant="link"
                    style={this.props.styles.link}
                    onPress={() => this.onPressOperation(item.op)}
                    accessory={() => <Accessory variant="button" size={10} />}>
                    {i18n.t(item.title)}
                </Button>
            );
        }
        return (
            <Button
                size="small"
                variant="action"
                style={this.props.styles.partition}
                onPress={() => this.onPressPartition(item)}
                accessory={() => <Accessory variant="button" size={10} />}>
                <View style={this.props.styles.partitionInfo}>
                    <Widget
                        size={36}
                        variant="icon"
                        badge={haveBadge}
                        backgroundColor={item.color}
                        source={doing.api.files.sourceBy(item)}
                        style={this.props.styles.partitionWidget}
                    />
                    <Typography style={{width: '100%'}} variant="subheading">
                        {item.name}
                    </Typography>
                </View>
            </Button>
        );
    };

    render() {
        const {styles, sections} = this.props;
        // noinspection RequiredAttributes
        return (
            <View testID="menu-tab" style={styles.container}>
                <Animated.SectionList
                    style={styles.list}
                    sections={sections}
                    removeClippedSubviews
                    onScroll={this.onScroll}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    contentInsetAdjustmentBehavior="never"
                    renderSectionFooter={this.renderSectionFooter}
                    renderSectionHeader={this.renderSectionHeader}
                    ListFooterComponent={this.renderFooter}
                    contentContainerStyle={styles.listContentContainer}
                />
                <NavBar
                    withFillAnimation
                    translucentStatusBar
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('tabs.menu')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                />
            </View>
        );
    }
}

export const navigationName = 'app.MenuTab';
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
    const hasAuthClient = ReduxUtils.hasAuthClient(state);
    return {
        themeName: state.theme.name,
        hasAuthClient,
        client: state.client.info || {},
        sections: [
            {
                data: _.values(state.partitions)
                    .filter((a: any) => a.viewType > 0)
                    .sort(compareFnByIndex),
                title: 'menu.partititons',
                type: 0,
            },
            {
                title: 'menu.extra',
                type: 1,
                data: [
                    ...(hasAuthClient
                        ? [
                              {op: Operations.profileSettings, title: 'menu.profileSettings'},
                              {op: Operations.support, title: 'menu.support'},
                          ]
                        : []),
                    {op: Operations.faq, title: 'menu.faq'},
                    {op: Operations.aboutService, title: 'menu.aboutService'},
                ],
            },
        ],
    };
})(withTheme(MenuTabScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;

/*

                            */
