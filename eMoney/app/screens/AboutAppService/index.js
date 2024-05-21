// @flow
import React from 'react';
import {connect} from 'react-redux';
import {getMessage} from '../../utils';
import type {ReduxState} from '../../reducers';
import DeviceInfo from 'react-native-device-info';
import {Navigation} from 'react-native-navigation';
import {View, Image, Linking, Alert} from 'react-native';
import {Accessory, Button, NavBar, Typography} from '../../components';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    privacyPolicy?: string,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

class AboutAppServiceScreen extends React.PureComponent<Props> {
    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onPressPrivacyPolicy = () => {
        if (!this.props.privacyPolicy) {
            return;
        }
        const url = this.props.privacyPolicy || '';
        Linking.canOpenURL(url)
            .then(() => Linking.openURL(url))
            .catch((error: any) => Alert.alert('Ошибка!', getMessage(error)));
    };

    onPressDevelopers = () => Linking.openURL('https://cyberiasoft.ru');

    renderLink = (text: string, onPress: () => any) => (
        <Button
            variant="link"
            onPress={onPress}
            style={this.props.styles.link}
            accessory={() => <Accessory variant="button" size={10} />}>
            {text}
        </Button>
    );

    render() {
        const {styles, privacyPolicy, isModal} = this.props;
        return (
            <View testID="about-app-service" style={styles.container}>
                <NavBar
                    useHardwareBackHandler
                    onPressBack={this.onPressClose}
                    title={i18n.t('aboutService.title')}
                    showBackButton={isModal ? 'close' : true}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
                <View style={styles.content}>
                    <View style={styles.versionBlock}>
                        <Image
                            resizeMode="contain"
                            style={styles.serviceLogo}
                            source={require('../../resources/images/img-full-logo.png')}
                        />
                        <View style={styles.varsionBadge}>
                            <Typography variant="body2" fontSize={10} color="#fff">
                                v{DeviceInfo.getReadableVersion()}
                            </Typography>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        {privacyPolicy
                            ? this.renderLink('Политика конфидициальности', this.onPressPrivacyPolicy)
                            : null}
                        {this.renderLink('Разработчики', this.onPressDevelopers)}
                    </View>
                </View>
            </View>
        );
    }
}

export const navigationName = 'app.AboutAppService';
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
    privacyPolicy: (state.auth.info || {}).privacyPolicy,
}))(withTheme(AboutAppServiceScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
