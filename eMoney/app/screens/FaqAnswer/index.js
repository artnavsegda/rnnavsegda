// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {NavBar, Typography} from '../../components';
import Markdown from 'react-native-markdown-package';
import {overlapScreenScrollValue} from '../../utils';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {Animated, View, Linking, InteractionManager} from 'react-native';
import {API_FAQ_GET_ANSWERS, STATUS_BAR_HEIGHT, type FAQ} from '../../constants';

import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    isParentTabs: boolean,
    componentId: any,
    questionId: number,
    isModal?: boolean,
    fetching: boolean,
    answer: FAQ,
    theme: Theme,
    styles: any,
};

class FaqAnswerScreen extends React.PureComponent<Props> {
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => doing.api.faq.getAnswersRequest(this.props.questionId).start());
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

    render() {
        const {styles, answer, fetching, isModal} = this.props;
        return (
            <View testID="faq-answer" style={styles.container}>
                <Animated.ScrollView
                    style={styles.list}
                    removeClippedSubviews
                    refreshing={fetching}
                    directionalLockEnabled
                    onScroll={this.onScroll}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.listContentContainer}>
                    {answer ? (
                        <View style={styles.answerBlock}>
                            <Typography paragraph variant="title">
                                {answer.question}
                            </Typography>
                            <Markdown styles={styles.answerMarkdown} onLink={url => Linking.openURL(url)}>
                                {answer.answer}
                            </Markdown>
                        </View>
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

export const navigationName = 'app.FaqAnswers';
export function getNC(questionId: number, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                questionId,
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
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    fetching: ReduxUtils.hasFetching(state, [API_FAQ_GET_ANSWERS]),
    answer: state.faq.answers[ownerProps.questionId || 0] || null,
}))(withTheme(FaqAnswerScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
