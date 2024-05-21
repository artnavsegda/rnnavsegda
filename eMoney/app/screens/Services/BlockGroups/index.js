// @flow
import React, {PureComponent} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Animated, View, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {type ReduxState, ReduxUtils} from '../../../reducers';
import * as R from 'ramda';
import hexToRgba from 'hex-to-rgba';
import {compareFnByIndex, overlapScreenScrollValue} from '../../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../../themes';
import {NavBar, Button, Typography, Widget, AdvertisingGroup} from '../../../components';
// import {EmptyAccount} from '../../components/UIKit';
import {
    STATUS_BAR_HEIGHT,
    MIN_SCREEN_SIZE,
    emptyObject,
    type ServiceGroup,
    type ServiceBlock,
} from '../../../constants';

const groupItemSize = (MIN_SCREEN_SIZE - 40) / 3.65 - 4;

import Services from '../index';

import doing from '../../../doing';

import getStyles from './styles';

export type Props = {
    componentId: any,
    block: ServiceBlock,
    isParentTabs: boolean,
    isModal?: boolean,
    blockId: number,
    type: number,
    theme: Theme,
    styles: any,
};

class BlockGroupsScreen extends PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    waitChangeNavigation: boolean = false;
    subscriptions: any[] = [];

    componentDidMount() {
        this.subscriptions = [Navigation.events().bindComponent(this)];
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription: any) => subscription.remove());
    }

    componentDidAppear() {
        this.waitChangeNavigation = false;
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
        return Navigation.pop(this.props.componentId);
    };

    onPressGroup = (group: ServiceGroup) => {
        if (this.waitChangeNavigation) {
            return;
        }
        this.waitChangeNavigation = true;
        Services.open(this.props.componentId, {group}).then(() => {
            this.waitChangeNavigation = false;
        });
    };

    keyExtractor = (item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`);

    //-------------------------------------------------
    // render section header
    //-------------------------------------------------
    renderSectionHeader = ({section}) =>
        section.title ? (
            <View style={this.props.styles.section}>
                <Typography variant="title">{section.title}</Typography>
            </View>
        ) : null;

    //--------------------------------------------
    // render list header
    //--------------------------------------------
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

    renderServiceGroup = (group: ServiceGroup) => {
        const {themeName} = this.props;
        return (
            <View key={`s.${group.id}`} style={this.props.styles.blockItemContainer}>
                <Widget
                    fontSize={11}
                    variant="service"
                    size={groupItemSize}
                    caption={group.name}
                    backgroundColor={hexToRgba(group.colorCart, 0.3)}
                    source={doing.api.files.sourceBy(group, doing.api.files.getPictureFlagName(themeName))}
                    onPress={() => this.onPressGroup(group)}
                />
            </View>
        );
    };

    renderItem = ({item}) => {
        const isSingleLine = R.pathOr(0, ['viewType'], item) > 0 ? false : true;
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

    render() {
        const {styles, block, advertising, isModal} = this.props;

        const blocksArray = new Array(block);
        const sections = blocksArray.map((blockData) => {
            return {
                id: blockData.id,
                title: blocksArray.length > 1 ? R.pathOr('Неизвестный блок', ['name'], blockData) : '',
                data: [{id: blockData.id, viewType: blockData.viewType, groups: blockData.groups}],
            };
        });
        console.log('BLOCK', sections);

        return (
            <View testID="block-groups" style={styles.container}>
                <Animated.SectionList
                    directionalLockEnabled
                    sections={sections}
                    style={styles.list}
                    removeClippedSubviews
                    onScroll={this.onScroll}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    keyboardShouldPersistTaps="handled"
                    contentInsetAdjustmentBehavior="never"
                    ListHeaderComponent={this.renderListHeader}
                    renderSectionHeader={this.renderSectionHeader}
                    contentContainerStyle={styles.listContentContainer}
                />
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    title={block.name || ''}
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
            </View>
        );
    }
}

export const navigationName = 'app.BlockGroups';
export function getNC(type: number, blockId: number, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                blockId,
                type,
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
    block: (state.services.blocks[ownerProps.type] || emptyObject)[ownerProps.blockId] || emptyObject,
    advertising: (state.advertising || emptyObject)[ownerProps.type] || emptyObject,
    hasAuthClient: ReduxUtils.hasAuthClient(state),
    themeName: state.theme.name,
}))(withTheme(BlockGroupsScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
