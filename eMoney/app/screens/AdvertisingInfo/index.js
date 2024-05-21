// @flow
import React from 'react';
import {connect} from 'react-redux';
import type {ReduxState} from '../../reducers';
import {Navigation} from 'react-native-navigation';
import Markdown from 'react-native-markdown-package';
import {Animated, Linking, View} from 'react-native';
import {doneByPromise, overlapScreenScrollValue} from '../../utils';
import {type Advertising, STATUS_BAR_HEIGHT} from '../../constants';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {NavBar, Typography, Image, Button, Accessory} from '../../components';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';
import Services from '../Services';
import Payments from '../Payments';
import Partitions from '../Partitions';

export type Props = {
    advertising: Advertising,
    isParentTabs?: boolean,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    loadingServiceInfo: boolean,
};

class AdvertisingInfoScreen extends React.PureComponent<Props, State> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    state: State = {
        loadingServiceInfo: false,
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
        return Navigation.pop(this.props.componentId);
    };

    onPressUlr = () => {
        if (!(this.props.advertising && this.props.advertising.url)) {
            return;
        }
        return Linking.openURL(this.props.advertising.url);
    };

    onPressUseService = () => {
        const {advertising, componentId, isParentTabs} = this.props;
        if (advertising.serviceId && advertising.serviceId > 0) {
            if (this.state.loadingServiceInfo) {
                return;
            }
            return this.setState({loadingServiceInfo: true}, () => {
                doneByPromise(
                    Services.open(
                        componentId,
                        {
                            id: advertising.serviceId,
                        },
                        {
                            isParentTabs,
                        },
                    ),
                    () => this.setState({loadingServiceInfo: false}),
                );
            });
        }
        if (advertising.serviceGroupId && advertising.serviceGroupId > 0) {
            return Services.openGroupById(componentId, advertising.serviceGroupId, {
                isParentTabs,
            });
        }
        if (advertising.moduleCode && advertising.moduleCode.length > 0) {
            Payments.resetNavigationStack();
            return Partitions.open(componentId, {
                code: advertising.moduleCode,
            });
        }
    };

    render() {
        const {styles, theme, advertising, isModal} = this.props;
        return (
            <View testID="advertising-info" style={styles.container}>
                <Animated.ScrollView
                    style={styles.list}
                    removeClippedSubviews
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}>
                    {advertising ? (
                        <>
                            <Image
                                resizeMode="cover"
                                style={styles.image}
                                loaderColor={theme.colors.primaryText}
                                source={doing.api.files.sourceBy(advertising, 'cartPicture')}
                            />
                            <Typography variant="title" fontSize={26}>
                                {advertising.name}
                            </Typography>
                            {(advertising.description || '').length > 0 ? (
                                <Markdown styles={styles.descriptionMarkdown} onLink={(url) => Linking.openURL(url)}>
                                    {advertising.description}
                                </Markdown>
                            ) : null}
                            {advertising.serviceId || advertising.serviceGroupId || advertising.moduleCode ? (
                                <View
                                    style={{
                                        marginTop: 20,
                                        marginBottom: !((advertising.url || '').length > 3) ? 20 : 0,
                                    }}>
                                    <Button
                                        variant="contained"
                                        onPress={this.onPressUseService}
                                        loading={this.state.loadingServiceInfo}
                                        accessory={<Accessory variant="button" size={10} />}>
                                        {i18n.t('advertisingInfo.goNext')}
                                    </Button>
                                </View>
                            ) : null}
                            {(advertising.url || '').length > 3 ? (
                                <View style={styles.linkBlock}>
                                    <Button
                                        variant="contained"
                                        onPress={this.onPressUlr}
                                        accessory={<Accessory variant="button" size={10} />}>
                                        {i18n.t('advertisingInfo.moreInfo')}
                                    </Button>
                                </View>
                            ) : null}
                        </>
                    ) : null}
                </Animated.ScrollView>
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
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

export const navigationName = 'app.AdvertisingInfo';
export function getNC(advertising: Advertising, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                advertising,
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(
    withTheme(AdvertisingInfoScreen, getStyles),
);

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
