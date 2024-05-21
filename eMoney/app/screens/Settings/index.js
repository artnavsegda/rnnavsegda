// @flow
import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import ActionSheet from 'react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {getMessage, overlapScreenScrollValue} from '../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {NavBar, Button, Image, Typography, CarouselDatePicker} from '../../components';
import {API_CLIENT_SET_AVATAR, STATUS_BAR_HEIGHT, type ClientInfo} from '../../constants';
import {Animated, View, Alert as RNAlert, InteractionManager, ActivityIndicator} from 'react-native';

import {getNC as getEditProfileNC} from '../EditProfile';
import ChangeAccessCode from '../ChangeAccessCode';
import Identification from '../Identification';
import PasswordSet from '../PasswordSet';
import Alert from '../Alert';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

import SetPhotoIcon from '../../resources/svg/set-photo-avatar.svg';

export type Props = {
    enableBiometrics: boolean,
    hasAccessHash: boolean,
    uploadAvatar: boolean,
    isParentTabs: boolean,
    client?: ClientInfo,
    language: string,
    themeName: string,
    componentId: any,
    fetching: boolean,
    isModal?: boolean,
    theme: Theme,
    styles: any,
};

type State = {
    avatar?: any,
};

class SettingsScreen extends React.Component<Props, State> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    mounted: boolean = false;
    state: State = {
        avatar: null,
    };

    componentDidMount() {
        this.mounted = true;
        InteractionManager.runAfterInteractions(() => doing.api.client.infoRequest().start());
    }

    componentWillUnmount() {
        this.mounted = false;
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

    onPressLogOff = () => {
        doing.api.client.logoffRequest().start();
        return this.onPressClose();
    };

    onPressChangeTheme = () => doing.theme.change();

    onPressIdentification = () => {
        const {client} = this.props;
        if (!client) {
            return;
        }
        if ((client.identification || 0) <= 0) {
            return Alert.show({
                type: 'info',
                title: i18n.t('settings.identifity'),
                content: i18n.t('settings.needGoToOfficeMessage'),
            });
        }
        return Identification.show();
    };

    onPressEditProfile = () =>
        Navigation.push(
            this.props.componentId,
            getEditProfileNC(
                {
                    isParentTabs: this.props.isParentTabs,
                },
                {
                    animations: {
                        push: {
                            waitForRender: false,
                        },
                    },
                },
            ),
        );

    onPressAccessCode = () => ChangeAccessCode.show();

    onPressSetPassword = () => PasswordSet.show();

    onPressLockAccount = () =>
        RNAlert.alert('Блокировка аккаунта', 'Уверены, что хотите заблокировать аккаунт?', [
            {
                text: 'Нет',
                style: 'cancel',
                onPress: () => {},
            },
            {text: 'Да', onPress: () => doing.api.client.disableRequest().start()},
        ]);

    onPressSetAvatar = () => {
        const success = (image) =>
            this.mounted &&
            this.setState({avatar: image}, () =>
                doing.api.client
                    .setAvatarRequest(this.state.avatar)
                    .success(() => doing.api.client.infoRequest().start())
                    .error((err: any) => {
                        this.mounted && this.setState({avatar: null});
                        RNAlert.alert('Ошибка!', getMessage(err));
                    })
                    .start(),
            );
        const cropOptions = {
            forceJpg: true,
            cropping: true,
            includeBase64: true,
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 1024,
        };
        ActionSheet.showActionSheetWithOptions(
            {
                cancelButtonIndex: 2,
                destructiveButtonIndex: 2,
                options: [i18n.t('settings.camera'), i18n.t('settings.gallery'), i18n.t('settings.cancel')],
            },
            (buttonIndex: number) => {
                switch (buttonIndex) {
                    case 0:
                        ImagePicker.openCamera(cropOptions).then(success);
                        break;
                    case 1:
                        ImagePicker.openPicker(cropOptions).then(success);
                        break;
                    default:
                        break;
                }
            },
        );
    };

    render() {
        const {theme, client, styles, isModal, fetching, themeName, uploadAvatar, hasAccessHash} = this.props;
        return (
            <View testID="settings" style={styles.container}>
                <Animated.ScrollView
                    style={styles.list}
                    removeClippedSubviews
                    refreshing={fetching}
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}>
                    {client ? (
                        <>
                            <Image
                                resizeMode="cover"
                                style={styles.avatar}
                                defaultSource={require('../../resources/images/img-empty-avatar.png')}
                                source={
                                    this.state.avatar
                                        ? {
                                              uri: `data:${(this.state.avatar || {}).mime || ''};base64,${
                                                  (this.state.avatar || {}).data || ''
                                              }`,
                                          }
                                        : doing.api.files.sourceBy(client)
                                }>
                                <View style={styles.avatarOverlay}>
                                    <Button variant="icon" disabled={uploadAvatar} onPress={this.onPressSetAvatar}>
                                        {uploadAvatar ? (
                                            <ActivityIndicator size="small" color="#fff" animating />
                                        ) : (
                                            <SetPhotoIcon
                                                height={styles.setAvatarIconSize}
                                                width={styles.setAvatarIconSize}
                                                fill="#fff"
                                            />
                                        )}
                                    </Button>
                                </View>
                            </Image>
                            <Typography variant="title" fontSize={28} fontWeight="normal">
                                {client.name || i18n.t('settings.emptyName')}
                            </Typography>
                            {client.dateOfBirth ? (
                                Moment(client.dateOfBirth).year() > CarouselDatePicker.emptyYear ? (
                                    <Typography>
                                        <Typography>
                                            {i18n.t('settings.clientYears', {
                                                count: Moment().diff(Moment(client.dateOfBirth), 'years'),
                                            })}
                                            {' · '}
                                        </Typography>
                                        <Typography color="secondary">
                                            {Moment(client.dateOfBirth).format('D MMMM YYYY')}
                                        </Typography>
                                    </Typography>
                                ) : (
                                    <Typography color="secondary">
                                        {Moment(client.dateOfBirth).format('D MMMM')}
                                    </Typography>
                                )
                            ) : null}
                            {client.city || client.country ? (
                                <Typography>{[client.country, client.city].filter((a) => !!a).join(', ')}</Typography>
                            ) : null}
                            <View style={styles.editProfileBlock}>
                                <Button variant="contained" onPress={this.onPressEditProfile}>
                                    {i18n.t('settings.editProfile')}
                                </Button>
                            </View>
                            {client && client.clientGuid.length > 4 ? (
                                <>
                                    <View style={styles.section}>
                                        <Typography variant="title">{i18n.t('settings.identifity')}</Typography>
                                    </View>
                                    <Button
                                        variant="link"
                                        style={styles.link}
                                        onPress={client.identification < 2 ? this.onPressIdentification : undefined}
                                        tintColor={client.identification >= 2 ? theme.colors.successText : undefined}>
                                        {client.identification >= 2
                                            ? i18n.t('settings.identified')
                                            : i18n.t('settings.goToIdentifity')}
                                    </Button>
                                    <View style={styles.section} />
                                    <View style={styles.section}>
                                        <Typography variant="title">{i18n.t('settings.security')}</Typography>
                                    </View>
                                    <Button variant="link" style={styles.link} onPress={this.onPressAccessCode}>
                                        {hasAccessHash
                                            ? i18n.t('settings.changeAccessCode')
                                            : i18n.t('settings.setAccessCode')}
                                    </Button>
                                    <Button variant="link" style={styles.link} onPress={this.onPressLockAccount}>
                                        {i18n.t('settings.lockAccount')}
                                    </Button>
                                    <Button variant="link" style={styles.link} onPress={this.onPressSetPassword}>
                                        {i18n.t('settings.setPassword')}
                                    </Button>
                                </>
                            ) : null}
                            <View style={styles.section} />
                            {client && client.clientGuid.length > 4 ? (
                                <>
                                    <View style={styles.section} />
                                    <Button
                                        variant="link"
                                        style={styles.link}
                                        onPress={this.onPressLogOff}
                                        tintColor={theme.colors.errorText}>
                                        {i18n.t('settings.logOff')}
                                    </Button>
                                </>
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
                    title={i18n.t('settings.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
            </View>
        );
    }
}

export const navigationName = 'app.Settings';
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
    client: state.client.info,
    themeName: state.theme.name || 'light',
    enableBiometrics: state.client.enableBiometrics,
    hasAccessHash: (state.client.accessHash || '').length > 4,
    uploadAvatar: ReduxUtils.hasFetching(state, [API_CLIENT_SET_AVATAR]),
}))(withTheme(SettingsScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
