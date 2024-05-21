// @flow
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {Animated, InteractionManager, View} from 'react-native';
import {Accessory, Button, NavBar, Typography} from '../../components';
import {compareFnByIndex, overlapScreenScrollValue} from '../../utils';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {API_FAQ_GET_ITEMS, STATUS_BAR_HEIGHT, type FAQGroup} from '../../constants';

import {getNC as getFaqAnswerNC} from '../FaqAnswer';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = {
    isParentTabs: boolean,
    componentId: any,
    fetching: boolean,
    isModal?: boolean,
    theme: Theme,
    items: any,
    styles: any,
};

class FaqScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => doing.api.faq.getItemsRequest().start());
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

    onPressQuestion = (questionId: number) =>
        Navigation.push(
            this.props.componentId,
            getFaqAnswerNC(questionId, {
                isParentTabs: this.props.isParentTabs,
            }),
        );

    keyExtractor = (item: any, index: number) => (item && item.id ? `id.${item.id}` : `i.${index}`);

    renderSectionHeader = ({section}) => (
        <View style={this.props.styles.section}>
            <Typography variant="title">{section.title}</Typography>
        </View>
    );

    renderItem = ({item}) => (
        <Button
            variant="link"
            style={this.props.styles.link}
            onPress={() => this.onPressQuestion(item.id)}
            accessory={() => <Accessory variant="button" size={10} />}>
            {item.question}
        </Button>
    );

    render() {
        const {styles, items, fetching, isModal} = this.props;
        return (
            <View testID="faq" style={styles.container}>
                <Animated.SectionList
                    style={styles.list}
                    sections={_.values(items)
                        .sort(compareFnByIndex)
                        .map((item: FAQGroup) => ({
                            data: item.questions,
                            title: item.name,
                            id: item.id,
                        }))}
                    removeClippedSubviews
                    refreshing={fetching}
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    automaticallyAdjustContentInsets={false}
                    renderSectionHeader={this.renderSectionHeader}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}
                />
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('faq.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
            </View>
        );
    }
}

export const navigationName = 'app.Faq';
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
    fetching: ReduxUtils.hasFetching(state, [API_FAQ_GET_ITEMS]),
    items: state.faq.items,
}))(withTheme(FaqScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
