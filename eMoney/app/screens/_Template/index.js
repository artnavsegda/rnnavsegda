// @flow
import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import type {ReduxState} from '../../reducers';
import {Navigation} from 'react-native-navigation';
import {withTheme, statusBarStyleGetter, type Theme} from '../../themes';

import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    isParentTabs?: boolean,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

class TemplateScreen extends React.PureComponent<Props> {
    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    render() {
        const {styles} = this.props;
        return (
            <View testID="template" style={styles.container}>
                <View />
            </View>
        );
    }
}

export const navigationName = 'app.Template';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({}))(withTheme(TemplateScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
