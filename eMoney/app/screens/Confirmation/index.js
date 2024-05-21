// @flow
import React from 'react';
import Moment from 'moment';
import { connect } from 'react-redux';
import { getMessage } from '../../utils';
import type { Account } from '../../constants';
import type { ReduxState } from '../../reducers';
import { Navigation } from 'react-native-navigation';
//import {Button} from 'react-native-elements';
//import BlurOverlay from 'react-native-blur-overlay';
import * as Animatable from 'react-native-animatable';
import * as R from 'ramda';
import { Button, Containers, Timer, Typography } from '../../components';
import { Platform, View, Image, Keyboard, TextInput, ActivityIndicator } from 'react-native';

import currency from '../../currency';
import doing from '../../doing';
import i18n from '../../i18n';

import styles from './styles';

type Operation = {
    result: number,
    price?: number,
    message?: string,
    currency?: string,
    account?: Account,
    operationId?: number,
};

export type Props = {
    repeatTimeout?: number,
    withOutEnterCode?: boolean,
    onClose?: (complete: boolean) => any,
    operation: Operation,
    componentId: any,
    title?: string, // default sms code
    size?: number, // default 5
};

type State = {
    visibleResult: boolean,
    timestamp: number,
    complete: boolean,
    loading: boolean,
    error: string,
    code: string,
};

class ConfirmationScreen extends React.Component<Props, State> {
    overlayRef: ?BlurOverlay = null;
    mounted: boolean = false;
    state: State = {
        timestamp: Math.floor(new Date() / 1000),
        visibleResult: false,
        complete: false,
        loading: false,
        error: '',
        code: '',
        codeFromPush: false,
    };

    componentWillMount() {
        const { pushNotifications } = this.props;
        if (pushNotifications.status) {
            this.setState({ codeFromPush: true });
        }
    }

    componentDidMount() {
        // for test
        // doing.app.notifications.addNotification({id: 10, type: 0, messageData: {code: '12345'}});
        // doing.app.notifications.addNotification({id: 12, messageData: {code: 'test'}});
        this.mounted = true;
        requestAnimationFrame(() => {
            this.overlayRef && this.overlayRef.openOverlay(600);
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps) {
        const { pushNotifications } = this.props;
        if (pushNotifications.status) {
            if (pushNotifications.notifications.length !== prevProps.pushNotifications.notifications.length) {
                const pushNotificationData = pushNotifications.notifications.find((data) => {
                    return data.type === 0;
                });
                console.log('FIND PUSH', pushNotificationData);
                const confirmCode = R.pathOr(false, ['code'], pushNotificationData.messageData);
                if (confirmCode) {
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState({ codeFromPush: true, code: confirmCode.toString() });
                }
            }
        }
    }

    showResult = () => this.mounted && this.setState({ visibleResult: true });

    onError = (error: any, visibleResult: boolean = true) => {
        // delete all code push messages
        doing.app.notifications.deleteAllNotificationsByType(0);
        // change state
        this.mounted &&
            this.setState({
                visibleResult,
                loading: false,
                complete: false,
                error: getMessage(error),
            });
    };

    onFinishInput = () => {
        const { operationId } = this.props.operation;
        doing.api.services
            .confirmOperationRequest(operationId || 0, this.state.code)
            .success(() => {
                this.mounted &&
                    this.setState({
                        error: '',
                        loading: false,
                        complete: true,
                        visibleResult: true,
                    });
                // delete all code push messages
                doing.app.notifications.deleteAllNotificationsByType(0);
            })
            .error((error) => this.onError(error, false))
            .start();
    };

    onPressClose = () => {
        Keyboard.dismiss();
        this.overlayRef &&
            this.overlayRef.closeOverlay(440, () => {
                const complete = this.props.withOutEnterCode || this.state.complete;
                const { operationId } = this.props.operation || {};
                if (!complete && (operationId || 0) > 0) {
                    doing.api.services.cancelOperationRequest(operationId || 0).start();
                }
                // delete all code push messages
                doing.app.notifications.deleteAllNotificationsByType(0);
                doing.api.accounts.getRequest().start();
                Navigation.dismissModal(this.props.componentId).then(() => {
                    this.props.onClose && this.props.onClose(complete);
                });
            });
    };

    onPressRepeatCode = () => {
        const { operationId } = this.props.operation;
        // delete all code push messages
        doing.app.notifications.deleteAllNotificationsByType(0);
        // call service
        doing.api.services
            .newOperationVerificationCodeRequest(operationId || 0)
            .success(
                () =>
                    this.mounted &&
                    this.setState({
                        timestamp: Math.floor(new Date() / 1000),
                        codeFromPush: false,
                        code: '',
                    }),
            )
            .error((error) => this.onError(error))
            .start();
    };

    onChangeCode = (code: string) => {
        const isFinished: boolean =
            code.length >= (this.props.size || 5) &&
            this.props.operation &&
            (this.props.operation.operationId || 0) > 0;
        this.mounted &&
            this.setState({ code, error: '', loading: isFinished }, isFinished ? this.onFinishInput : undefined);
    };

    confirmOperation = () => {
        this.setState({ error: '', loading: true }, () => this.onFinishInput());
    };

    onOverlayRef = (ref: any) => (this.overlayRef = ref);

    renderTitle = () => {
        const { codeFromPush, code } = this.state;

        if (codeFromPush && code.length === 5) {
            return (
                <Typography style={styles.title} variant="body1" align="center" color="#fff">
                    {i18n.t('confirmation.passwordFromPush')}
                </Typography>
            );
        } else if (!codeFromPush) {
            return (
                <Typography style={styles.title} variant="body1" align="center" color="#fff">
                    {this.props.title || i18n.t('confirmation.title')}
                </Typography>
            );
        }

        return (
            <Typography style={styles.title} variant="body1" align="center" color="#fff">
                {i18n.t('confirmation.whileWaitPasswordFromPush')}
            </Typography>
        );
    };

    renderCodeInput = () => {
        const { codeFromPush, code } = this.state;
        const hasError = this.state.error.length > 0;
        return (
            <Containers.KeyboardAvoiding style={styles.content}>
                <Animatable.View
                    delay={250}
                    duration={334}
                    useNativeDriver
                    animation="fadeInLeft"
                    style={styles.closeButtonWrapper}>
                    <Button
                        variant="icon"
                        style={styles.closeButton}
                        onPress={this.onPressClose}
                        disabled={this.state.loading}>
                        <Image
                            style={[styles.closeIcon, this.state.loading ? { opacity: 0.5 } : {}]}
                            source={require('../../resources/icons/ic-close.png')}
                            resizeMode="contain"
                        />
                    </Button>
                </Animatable.View>
                <Animatable.View
                    duration={334}
                    useNativeDriver
                    style={styles.form}
                    animation={`fade${this.state.complete ? 'Out' : 'In'}`}
                    onAnimationEnd={this.state.complete ? this.showResult : undefined}>
                    <View style={styles.formBody}>
                        {this.renderTitle()}
                        <View style={styles.inputBlock}>
                            <TextInput
                                autoFocus
                                secureTextEntry
                                numberOfLines={1}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCompleteType="off"
                                value={this.state.code}
                                keyboardType="number-pad"
                                keyboardAppearance="dark"
                                editable={!this.state.loading}
                                maxLength={this.props.size || 5}
                                onChangeText={this.onChangeCode}
                            />
                            <ActivityIndicator
                                animating={this.state.loading}
                                style={styles.indicator}
                                hidesWhenStopped
                                size="small"
                                color="#fff"
                            />
                        </View>
                        <View
                            style={[
                                styles.bottomBorder,
                                !this.state.loading && hasError ? { backgroundColor: '#DE4B43' } : undefined,
                            ]}
                        />
                    </View>
                    {!this.state.loading && !this.state.complete && !(this.state.error.length > 0) ? (
                        <Timer duration={this.props.repeatTimeout || 30} from={this.state.timestamp}>
                            {(left: number) =>
                                left > 0 ? (
                                    <Typography
                                        color="#fff"
                                        align="center"
                                        fontSize={12}
                                        variant="body1"
                                        style={styles.timerText}>
                                        {i18n.t('confirmation.repeatAfterTime', { time: left })}
                                    </Typography>
                                ) : (
                                    <Button variant="uncontained" tintColor="#fff" onPress={this.onPressRepeatCode}>
                                        {i18n.t('confirmation.repeat')}
                                    </Button>
                                )
                            }
                        </Timer>
                    ) : null}
                    {!this.state.loading && hasError ? (
                        <>
                            <Typography
                                fontSize={14}
                                align="center"
                                variant="body2"
                                color="#DE4B43"
                                style={styles.errorText}>
                                {this.state.error}
                            </Typography>
                            <Button variant="uncontained" tintColor="#fff">
                                {i18n.t('confirmation.sendNewCode')}
                            </Button>
                        </>
                    ) : null}
                    {codeFromPush && code.length === 5 ? (
                        <Button style={styles.acceptedContainer} variant="contained" onPress={this.confirmOperation}>
                            {i18n.t('confirmation.accepted')}
                        </Button>
                    ) : null}
                </Animatable.View>
            </Containers.KeyboardAvoiding>
        );
    };

    renderResult = () => {
        const { operation } = this.props;
        const isFail = (this.state.error || '').length > 0 || operation.result > 3;
        return (
            <View style={styles.content}>
                <View style={{ flex: 1 }} />
                <Animatable.View duration={334} useNativeDriver animation="fadeIn" style={styles.resultBlock}>
                    <View style={styles.resultStatusContainer}>
                        <View style={[styles.resultStatus, isFail ? styles.failStatusFill : styles.successStatusFill]}>
                            <Image
                                style={styles.statusIcon}
                                source={
                                    isFail
                                        ? require('../../resources/icons/ic-fail-operation.png')
                                        : require('../../resources/icons/ic-success-operation.png')
                                }
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <Typography variant="title" color="#252525">
                        {i18n.t(`confirmation.${isFail ? 'fail' : 'success'}Title`)}
                    </Typography>
                    <Typography
                        paragraph
                        variant="body1"
                        color={isFail && this.state.error.length > 0 ? '#b00b0b' : '#252525'}>
                        {i18n.t(`confirmation.${isFail ? 'fail' : 'success'}Details`)}
                        {isFail ? `\r\n${this.state.error}` : ''}
                    </Typography>
                    <View style={styles.separator} />
                    <Typography variant="body1" paragraph={16} color="#777777">
                        {Moment().format('Do MMMM YYYY, hh:mm')}
                    </Typography>
                    <Typography variant="body1" paragraph={2} fontWeight="500" color="#999999">
                        {i18n.t('confirmation.amount')}
                    </Typography>
                    <Typography variant="display1" fontSize={28} paragraph={12} color="#252525">
                        {currency(operation.price, operation.currency || '').format(true)}
                    </Typography>
                    {operation.account ? (
                        <>
                            <Typography variant="body1" paragraph={2} fontWeight="500" color="#999999">
                                {i18n.t('confirmation.account')}
                            </Typography>
                            <Typography variant="subheading" paragraph={8} color="#252525">
                                {(operation.account || {}).number || ''}
                            </Typography>
                        </>
                    ) : null}
                </Animatable.View>
                <View style={{ flex: 1 }} />
                <Animatable.View
                    delay={250}
                    duration={334}
                    useNativeDriver
                    animation="fadeInDown"
                    style={{ marginTop: 20 }}>
                    <Button variant="icon" onPress={this.onPressClose} style={styles.bottomCloseButton}>
                        <Image
                            source={require('../../resources/icons/ic-close.png')}
                            style={styles.closeIcon}
                            resizeMode="contain"
                        />
                    </Button>
                </Animatable.View>
            </View>
        );
    };

    render() {
        const { withOutEnterCode } = this.props;
        console.log('CONFIRM', this.props.pushNotifications);
        return (
            <View
                style={{ flex: 1 }}
                testID="confirmation"
                ref={this.onOverlayRef}
                customStyles={styles.container}>
                {withOutEnterCode || this.state.visibleResult ? this.renderResult() : this.renderCodeInput()}
            </View>
        );
    }
}

export const navigationName = 'app.Confirmation';
export function getNC(operation: Operation, props: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(props || {}),
                skipThemingStatusBar: true,
                operation,
            },
            options: {
                topBar: {
                    visible: false,
                },
                layout: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    componentBackgroundColor: 'rgba(0,0,0,0)',
                },
                modalPresentationStyle: Platform.select({ ios: 'overFullScreen', android: 'overCurrentContext' }),
                ...(options || {}),
                statusBar: {
                    visible: true,
                    style: 'light',
                    drawBehind: true,
                    backgroundColor: 'transparent',
                },
                animations: {
                    ...((options || {}).animations || {}),
                    showModal: {
                        enabled: 'false',
                        waitForRender: true,
                    },
                    dismissModal: {
                        enabled: 'false',
                    },
                },
            },
        },
    };
}

export function show(operation: Operation, props: any) {
    return Navigation.showModal(getNC(operation, props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    pushNotifications: state.pushNotifications,
}))(ConfirmationScreen);

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
