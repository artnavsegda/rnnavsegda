// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { ReduxState } from '../../reducers';
import Logo from '../../resources/svg/logo.svg';
import { Navigation } from 'react-native-navigation';
import { themeByName, type Theme } from '../../themes';
import { View, Animated, InteractionManager, Alert } from 'react-native';
import { MIN_SCREEN_SIZE } from '../../constants';

import { getNC as getMainTabsNC } from '../Tabs';
import { getNC as getLockNC } from '../Lock';

import doing from '../../doing';

import styles from './styles';
import Application from '../../modules/application';
import { doneByPromise } from '../../utils';

export type Props = {
    hasAccessCode: boolean,
    skipSecurity?: boolean,
    componentId: any,
    hasToken: boolean,
    theme: Theme,
};

const END_SCALE = 160;
const MIN_SCALE = (MIN_SCREEN_SIZE * 0.234) / 1024;

class SplashScreen extends React.PureComponent<Props> {
    scale: Animated.Value = new Animated.Value(MIN_SCALE);
    opacity: Animated.Value = new Animated.Value(1);
    navigationEventListener: any = null;
    animation: any = null;

    componentDidMount() {
        // Operations.clearAllFetchingTimes();
        this.navigationEventListener = Navigation.events().bindComponent(this);
        this.animation = Animated.loop(
            Animated.sequence([
                Animated.timing(this.scale, {
                    useNativeDriver: true,
                    duration: 400,
                    toValue: MIN_SCALE * 0.8,
                }),
                Animated.timing(this.scale, {
                    toValue: MIN_SCALE,
                    useNativeDriver: true,
                    duration: 300,
                }),
            ]),
        );
        this.animation.start();
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    // noinspection JSUnusedGlobalSymbols
    componentDidAppear() {
        InteractionManager.runAfterInteractions(async () => {
            try {
                await Application.registerPushNotificationsToken();
                doing.app.notifications.changePushNotificationsStatus(true);
                console.log('PUSH TOKEN DONE');
            } catch (error) {
                doing.app.notifications.changePushNotificationsStatus(false);
                console.log('ERROR GET TOKEN FOR PUSH', error);
            }

            console.log('HAS AUTH TOKEN', this.props);
            if (this.props.hasToken) {
                // get info
                doing.api.auth
                    .getSettings()
                    .then(() => {
                        // navigate next
                        return this.movingNext();
                    })
                    .catch((error) => {
                        console.log('ERROR GET SETTINGS', error);
                        Alert.alert('Error', 'Cannot communicate with server', [
                            { text: "Try Again", onPress: () => this.componentDidAppear() }
                        ])
                        return;
                    });
            } else {
                // need refresh
                doing.api.auth.refreshToken().then(this.movingNext)
                    .catch((error) => {
                        console.log('ERROR GET PUSH', error);
                        Alert.alert('Error', 'Cannot communicate with push notifications serice', [
                            { text: "Try Again", onPress: () => this.componentDidAppear() }
                        ])
                        return;
                    });
            }
        });
    }

    endLoading = (cb: () => any) => {
        if (this.animation != null) {
            this.animation.stop();
        }
        this.animation = Animated.parallel([
            Animated.timing(this.scale, {
                useNativeDriver: true,
                toValue: END_SCALE * MIN_SCALE,
                duration: 600,
            }),
            Animated.timing(this.opacity, {
                useNativeDriver: true,
                duration: 400,
                delay: 128,
                toValue: 0,
            }),
        ]);
        this.animation.start(cb);
    };

    movingNext = () => {
        doing.api.client.infoRequest().start();
        setTimeout(() => {
            this.endLoading(() => {
                if (this.props.hasAccessCode && !(this.props.skipSecurity || false)) {
                    return Navigation.setStackRoot(this.props.componentId, getLockNC());
                }
                return Navigation.setStackRoot(this.props.componentId, getMainTabsNC(this.props.theme));
            });
        }, 480);
    };

    render() {
        return (
            <View testID="splash" style={styles.container}>
                <View style={styles.content}>
                    <Animated.View style={[styles.logo, { opacity: this.opacity, transform: [{ scale: this.scale }] }]}>
                        {/* <Logo width="100%" height="100%" fill={styles.logoColor} /> */}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

export const navigationName = 'app.Splash';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                skipThemingStatusBar: true,
            },
            options: {
                statusBar: {
                    visible: true,
                    drawBehind: true,
                    style: styles.statusBarStyle,
                    backgroundColor: 'transparent',
                },
                layout: {
                    orientation: ['portrait'],
                    backgroundColor: styles.backgroundColor,
                    componentBackgroundColor: styles.backgroundColor,
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState) => ({
    hasToken: (state.auth.token || '').length > 1,
    // skipOnBoard: state.client.skipOnBoard || false,
    hasAccessCode: (state.client.accessHash || '').length > 4,
    theme: themeByName(state.theme.name),
}))(SplashScreen);

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = true;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
