import React from 'react';
import {connect} from 'react-redux';
import {doneByPromise} from '../../utils';
import {Containers, Typography} from '../../components';
import type {ReduxState} from '../../reducers';
import {withTheme, type Theme} from '../../themes';
import {Navigation} from 'react-native-navigation';
import {Keyboard, Platform, View} from 'react-native';

import getStyles from './styles';

export type Props = {
    onClose?: ?() => any,
    componentId: any,
    theme: Theme,
    styles: any,
};

class NotificationModalScreen extends React.PureComponent<Props> {
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
        const {styles, item} = this.props;
        console.log('PROPS', this.props);
        return (
            <Containers.BPS
                styles={styles.bps}
                useHardwareBackHandler
                testID="notification-modal"
                ref={this.onBottomPanelRef}
                onPressBackdrop={this.onPressClose}>
                <View style={styles.notificationModalContainer}>
                    <Typography variant="subheading" color="primary" align="left" numberOfLines={1}>
                        {item.body}
                    </Typography>
                    <Typography style={{marginTop: 20}} color="primary">
                        {item.data || ''}
                    </Typography>
                </View>
            </Containers.BPS>
        );
    }
}

export const navigationName = 'app.NotificationModalScreen';
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

export function show(props: any = {}) {
    return Navigation.showModal(getNC(props));
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(
    withTheme(NotificationModalScreen, getStyles),
);

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
