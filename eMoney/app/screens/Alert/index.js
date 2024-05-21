// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {doneByPromise} from '../../utils';
import type {ReduxState} from '../../reducers';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {Image, Keyboard, Platform, View} from 'react-native';
import {Button, Containers, Typography} from '../../components';

import getStyles from './styles';

import AlertIconSource from '../../resources/icons/ic-alert.png';

type AlertAction = {
    style?: any,
    text: string,
    onPress?: () => any,
    variant?: 'text' | 'link' | 'outlined' | 'contained' | 'uncontained' | 'action' | 'icon',
};

type ShowProps = {
    theme?: Theme,
    onClose?: ?() => any,
    type?: 'info' | 'warning' | 'error' | 'success',
    actions?: AlertAction[],
    title: string,
    content: any,
};

export type Props = ShowProps & {
    componentId: any,
    styles: any,
    theme: Theme,
};

class AlertScreen extends React.PureComponent<Props> {
    bottomPanelRef: ?Containers.BPS = null;
    navigationEventListener: any = null;
    mounted: boolean = false;

    componentDidMount() {
        this.mounted = true;
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear() {}

    onPressClose = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            Keyboard.dismiss();
            if (!this.props.componentId) {
                this.props.onClose && this.props.onClose();
                return resolve();
            }
            const dismissFn = () => {
                Navigation.dismissModal(this.props.componentId)
                    .then(() => {
                        this.props.onClose && this.props.onClose();
                        resolve();
                    })
                    .catch(reject);
            };
            if (this.bottomPanelRef) {
                // noinspection JSUnresolvedFunction
                return doneByPromise(this.bottomPanelRef.hide(), dismissFn);
            }
            dismissFn();
        });
    };

    onBottomPanelRef = (ref: any) => (this.bottomPanelRef = ref);

    render() {
        const {styles, title, content, actions, type} = this.props;
        return (
            <Containers.BPS
                styles={styles.bps}
                useHardwareBackHandler
                ref={this.onBottomPanelRef}
                testID={`alert-${type || 'basic'}}`}>
                <View style={styles.header}>
                    <Animatable.View
                        duration={334}
                        useNativeDriver
                        animation="fadeIn"
                        style={[styles.typeBlock, type ? styles[`${type || 'error'}Fill`] : undefined]}>
                        <Image style={styles.typeIcon} resizeMode="contain" source={AlertIconSource} />
                    </Animatable.View>
                    <Typography
                        fontWeight={type && type === 'error' ? 'bold' : undefined}
                        variant="subheading"
                        style={{flex: 1}}
                        color="primary"
                        align="left">
                        {title}
                    </Typography>
                </View>
                <View style={styles.content}>
                    {_.isString(content) ? (
                        <Typography variant="body1" color="primary">
                            {content}
                        </Typography>
                    ) : (
                        content
                    )}
                    <View style={styles.actions}>
                        {actions && actions.length > 0 ? (
                            actions.map((action: AlertAction, index: number) => (
                                <View style={index > 0 ? {marginTop: 10} : undefined}>
                                    <Button
                                        key={`a.${index}`}
                                        style={action.style}
                                        alignContent="center"
                                        variant={action.variant || 'contained'}
                                        onPress={() => this.onPressClose().then(action.onPress)}>
                                        {action.text}
                                    </Button>
                                </View>
                            ))
                        ) : (
                            <Button variant="contained" alignContent="center" onPress={this.onPressClose}>
                                Хорошо
                            </Button>
                        )}
                    </View>
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.Alert';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                skipThemingStatusBar: true,
            },
            options: {
                topBar: {
                    visible: false,
                },
                layout: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    componentBackgroundColor: 'rgba(0,0,0,0)',
                },
                modalPresentationStyle: Platform.select({ios: 'overFullScreen', android: 'overCurrentContext'}),
                statusBar: {
                    visible: true,
                    style: 'light',
                    drawBehind: true,
                    backgroundColor: 'transparent',
                },
                ...(options || {}),
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

export function show(props: ShowProps) {
    return Navigation.showModal(getNC(props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(withTheme(AlertScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
