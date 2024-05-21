// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {type ReduxState, ReduxUtils} from '../../reducers';
import * as R from 'ramda';
import {AdvertisingGroup, NavBar, Typography, Widget} from '../../components';
import {compareFnByIndex, overlapScreenScrollValue} from '../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {ActivityIndicator, Animated, InteractionManager, ScrollView, View} from 'react-native';
import {
    SupportedPartitions,
    API_SERVICES_GET_GROUPS,
    STATUS_BAR_HEIGHT,
    MIN_SCREEN_SIZE,
    emptyObject,
    type Partition,
    type ServiceBlock,
    type ServiceGroup,
} from '../../constants';

import i18n from '../../i18n';
import doing from '../../doing';

import Services from '../Services';

import getStyles from './styles';

export type Props = {
    blocks: {[id: number]: ServiceBlock},
    hasParentScreen?: boolean,
    hasAuthClient: boolean,
    partition: Partition,
    advertising: any,
    fetching: boolean,
    isModal?: boolean,
    language: string,
    componentId: any,
    theme: Theme,
    type: number,
    styles: any,
};

const emitter = new EventEmitter(null);
const resetNavigationEventName = 'reset-navigation';
const groupItemSize = (MIN_SCREEN_SIZE - 40) / 3.65 - 4;

class PaymentsScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    waitChangeNavigation: boolean = false;
    subscriptions: any[] = [];

    componentDidMount() {
        this.subscriptions = [
            Navigation.events().bindComponent(this),
            emitter.addListener(resetNavigationEventName, this.onResetNavigationStack),
        ];
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription: any) => subscription.remove());
    }

    componentDidAppear() {
        this.waitChangeNavigation = false;
        InteractionManager.runAfterInteractions(() => doing.api.services.getGroupsRequest().start());
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.language !== prevProps.language) {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    text: i18n.t('tabs.payments'),
                },
            });
        }
    }

    onResetNavigationStack = () => {
        return Navigation.popToRoot(this.props.componentId);
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

    onPressServiceGroup = (group: ServiceGroup) => {
        if (this.waitChangeNavigation) {
            return;
        }
        this.waitChangeNavigation = true;
        return Services.open(
            this.props.componentId,
            {group},
            {
                isParentTabs: true,
            },
        ).then(() => {
            this.waitChangeNavigation = false;
        });
    };

    keyExtractor = (item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`);

    renderSectionHeader = ({section}) =>
        section.title ? (
            <View style={this.props.styles.section}>
                <Typography variant="title">{section.title}</Typography>
            </View>
        ) : null;

    renderServiceGroup = (group: ServiceGroup) => {
        const {themeName} = this.props;
        return group ? (
            <View key={`s.${group.id}`} style={this.props.styles.groupItem}>
                <Widget
                    fontSize={11}
                    variant="service"
                    size={groupItemSize}
                    caption={group.name}
                    backgroundColor={group.colorPicture}
                    source={doing.api.files.sourceBy(group, doing.api.files.getPictureFlagName(themeName))}
                    onPress={() => this.onPressServiceGroup(group)}
                />
            </View>
        ) : null;
    };

    renderItem = ({item}) => {
        const isSingleLine = (item.viewType || 0) <= 0;
        const groups = (item.groups || []).filter((a) => a.viewType > 0);
        if (groups.length < 1) {
            return null;
        }
        return (
            <ScrollView
                horizontal
                removeClippedSubviews
                directionalLockEnabled
                style={this.props.styles.groupsList}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={[
                    this.props.styles.groupsListContainer,
                    !isSingleLine
                        ? {
                              flexDirection: 'column',
                          }
                        : undefined,
                ]}>
                {isSingleLine
                    ? groups.map(this.renderServiceGroup)
                    : _.chunk(groups, Math.ceil(groups.length / 2)).map((chunks: ServiceGroup[], index: number) => (
                          <View key={`l.${item.id}.${index}`} style={this.props.styles.groupsRow}>
                              {chunks.map(this.renderServiceGroup)}
                          </View>
                      ))}
            </ScrollView>
        );
    };

    renderListHeader = () =>
        _.values(this.props.advertising)
            .sort(compareFnByIndex)
            .map((group: any) => (
                <AdvertisingGroup
                    isParentTabs={true}
                    key={`ag.${group.id}`}
                    componentId={this.props.componentId}
                    contentContainerStyle={this.props.styles.advertisingGroup}
                    {...group}
                />
            ));

    render() {
        const {styles, type, theme, partition, blocks, isModal, fetching} = this.props;
        const blockArray = _.values(blocks).sort(compareFnByIndex);

        return (
            <View testID="payments" style={styles.container}>
                <Animated.SectionList
                    sections={blockArray.map((block: ServiceBlock) => ({
                        id: block.id,
                        title: blockArray.length > 1 ? block.name : undefined,
                        data: [{id: block.id, viewType: block.viewType, groups: block.groups}],
                    }))}
                    style={styles.list}
                    refreshing={fetching}
                    removeClippedSubviews
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    contentInsetAdjustmentBehavior="never"
                    automaticallyAdjustContentInsets={false}
                    ListHeaderComponent={this.renderListHeader}
                    ListFooterComponentStyle={{paddingBottom: 16}}
                    renderSectionHeader={this.renderSectionHeader}
                    contentContainerStyle={styles.listContentContainer}
                />
                <NavBar
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                    title={(partition || {}).name || i18n.t(`payments.title${type}`)}
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
            </View>
        );
    }
}

export const navigationName = 'app.Payments';
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
    const partitionCode = sectionType === 4 ? SupportedPartitions.transfer : SupportedPartitions.pay;
    return {
        partition: state.partitions[partitionCode],
        hasAuthClient: ReduxUtils.hasAuthClient(state),
        advertising: (state.advertising || emptyObject)[sectionType] || emptyObject,
        fetching: ReduxUtils.hasFetching(state, [API_SERVICES_GET_GROUPS]),
        blocks: (state.services.blocks || {})[ownerProps.type || 0] || emptyObject,
        themeName: state.theme.name,
    };
})(withTheme(PaymentsScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

reduxConnector.resetNavigationStack = () => {
    emitter.emit(resetNavigationEventName);
};

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
