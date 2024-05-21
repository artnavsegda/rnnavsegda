// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import LogIn from '../../LogIn';
import {ReduxUtils, type ReduxState} from '../../../reducers';
import {Animated, View, InteractionManager} from 'react-native';
import {NavBar, Button, Typography, Image, EmptyAccount} from '../../../components';
import {statusBarStyleGetter, withTheme, type Theme} from '../../../themes';
import {compareFnByIndex, fetchingKey, overlapScreenScrollValue} from '../../../utils';
import {
    API_SERVICES_GET_GROUP_ITEMS,
    STATUS_BAR_HEIGHT,
    emptyObject,
    type Service,
    type ServiceGroup,
} from '../../../constants';

import Services from '../index';

import doing from '../../../doing';

import getStyles from './styles';

export type Props = {
    componentId: any,
    fetching: boolean,
    group: ServiceGroup,
    isParentTabs: boolean,
    services: {[id: number]: Service},
    isModal?: boolean,
    groupId: number,
    theme: Theme,
    styles: any,
};

class GroupServicesScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    waitChangeNavigation: boolean = false;
    subscriptions: any[] = [];

    componentDidMount() {
        this.subscriptions = [Navigation.events().bindComponent(this)];
        InteractionManager.runAfterInteractions(() => doing.api.services.getRequest(this.props.groupId).start());
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

    onPressLogIn = () => LogIn.show();

    onPressService = (service: Service) => {
        if (this.waitChangeNavigation) {
            return;
        }
        this.waitChangeNavigation = true;
        return Services.open(
            this.props.componentId,
            {
                service,
                group: this.props.group,
            },
            {isParentTabs: !this.props.isModal && this.props.isParentTabs},
        ).then(() => {
            this.waitChangeNavigation = false;
        });
    };

    keyExtractor = (item) => `s.${item.id}`;

    renderItem = ({item}: any) => (
        <Button variant="action" style={this.props.styles.item} onPress={() => this.onPressService(item)}>
            <Image resizeMode="contain" style={this.props.styles.itemIcon} source={doing.api.files.sourceBy(item)} />
            <Typography variant="subheading" fontSize={15} style={{flex: 1}}>
                {item.name}
            </Typography>
        </Button>
    );

    //-------------------------------------------------
    // render auth screen
    //-------------------------------------------------
    renderAuthScreen = () => {
        return <EmptyAccount onPressLogIn={this.onPressLogIn} />;
    };

    render() {
        const {styles, services, group, fetching, isModal, hasAuthClient} = this.props;

        if (!hasAuthClient) {
            return (
                <View style={{flex: 1}}>
                    {this.renderAuthScreen()}
                    <NavBar
                        showBackButton
                        withFillAnimation
                        useHardwareBackHandler
                        title={group.name || ''}
                        style={styles.fixedNavBar}
                        withBottomBorder="animated"
                        onPressBack={this.onPressClose}
                        scrollY={overlapScreenScrollValue(this.scrollY)}
                        translucentStatusBar={isModal ? 'adaptive' : true}
                    />
                </View>
            );
        }
        return (
            <View testID="group-services" style={styles.container}>
                <Animated.FlatList
                    style={styles.list}
                    removeClippedSubviews
                    refreshing={fetching}
                    onScroll={this.onScroll}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    keyboardShouldPersistTaps="handled"
                    contentInsetAdjustmentBehavior="never"
                    data={_.values(services).sort(compareFnByIndex)}
                    contentContainerStyle={styles.listContentContainer}
                />
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    title={group.name || ''}
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

export const navigationName = 'app.GroupServices';
export function getNC(groupId: number, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                groupId,
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
    group: state.services.groups[ownerProps.groupId] || emptyObject,
    services: state.services.groupItems[ownerProps.groupId] || emptyObject,
    fetching: ReduxUtils.hasFetching(state, [fetchingKey(API_SERVICES_GET_GROUP_ITEMS, ownerProps.groupId)]),
    hasAuthClient: ReduxUtils.hasAuthClient(state),
}))(withTheme(GroupServicesScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
