// @flow
import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import WebView from 'react-native-webview';
import type {ReduxState} from '../../reducers';
import {Gradient, NavBar} from '../../components';
import {Navigation} from 'react-native-navigation';
import {withTheme, type Theme} from '../../themes';

import getStyles from './styles';

export type Props = {
    onSuccess?: () => any,
    onFailure?: () => any,
    onCancel?: () => any,
    componentId: any,
    familyId: number,
    bankUrl: string,
    theme: Theme,
    styles: any,
};

class ExternalPaymentScreen extends React.PureComponent<Props> {
    onPressClose = () => Navigation.dismissModal(this.props.componentId);

    onPressCancel = () => this.onPressClose().then(this.props.onCancel);

    onNavigationStateChange = (event: any) => {
        console.log('WEB EVENTS', event);
        if (event.url && event.url.toLowerCase().includes('approved')) {
            return this.onPressClose().then(this.props.onSuccess);
        } else if (event.url && event.url.toLowerCase().includes('orderfault')) {
            return this.onPressClose().then(this.props.onFailure);
        }
    };

    renderNavBarGradient = (theme: Theme) => <Gradient {...theme.gradients.button} style={{flex: 1}} animated />;

    render() {
        const {styles, bankURL, theme} = this.props;
        console.log('BANK', bankURL);
        return (
            <View testID="external-payment" style={styles.container}>
                <NavBar
                    useSafeArea
                    title="Оплата"
                    variant="transparent"
                    showBackButton="close"
                    translucentStatusBar="adaptive"
                    onPressBack={this.onPressCancel}
                    color={theme.colors.buttonCaption}
                    backgroundRenderer={this.renderNavBarGradient(theme)}
                />
                <WebView
                    scalesPageToFit
                    useWebKit={false}
                    javaScriptEnabled
                    startInLoadingState
                    source={{uri: bankURL}}
                    originWhitelist={['*']}
                    style={styles.container}
                    automaticallyAdjustContentInsets
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}

export const navigationName = 'app.ExternalPayment';
export function getNavigationComponent(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: passProps || {},
            options: {
                topBar: {
                    animate: false,
                    visible: false,
                    drawBehind: true,
                    backButton: {
                        visible: false,
                    },
                },
                modal: {
                    swipeToDismiss: false,
                },
                statusBar: {
                    visible: true,
                    style: 'light',
                    drawBehind: true,
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(
    withTheme(ExternalPaymentScreen, getStyles),
);

reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;
reduxConnector.getNavigationComponent = getNavigationComponent;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
