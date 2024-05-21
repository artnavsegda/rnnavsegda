// @flow
import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
import {connect} from 'react-redux';
import RNTextSize from 'react-native-text-size';
import {Navigation} from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {compareFnByInvertedIndex, defArray} from '../../utils';
import {NavBar, Containers, Typography} from '../../components';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {
    API_SUPPORT_SEND_MESSAGE,
    MAX_MESSAGE_TEXT_WIDTH,
    API_SUPPORT_GET_ITEMS,
    STATUS_BAR_HEIGHT,
    TAB_BAR_HEIGHT,
    NAV_BAR_HEIGHT,
    BOTTOM_SPACE,
    emptyObject,
    type SupportMessage,
} from '../../constants';
import {
    Text,
    View,
    Image,
    Keyboard,
    Animated,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import i18n from '../../i18n';
import doing from '../../doing';

import getStyles from './styles';

export type Props = {
    isParentTabs?: boolean,
    fetching: boolean,
    isModal?: boolean,
    sending: boolean,
    componentId: any,
    messages: any,
    theme: Theme,
    styles: any,
};

type ListData = {
    type: number,
    date?: number,
    name?: string,
    message?: SupportMessage,
};

type State = {
    fontInfo: any,
    messages: any,
    inputText: string,
    inputHeight: number,
    largeContent: boolean,
    dataProvider: DataProvider,
};

const TIME_HEIGHT = 18;
const DATE_ITEM_HEIGHT = 44;
const EMPTY_ITEM_HEIGHT = 48;
const OPERATOR_NAME_HEIGHT = 20;

function checkIncomingForManagerId(managerId: ?number): boolean {
    if (_.isUndefined(managerId) || managerId === null) {
        return false;
    }
    return _.isNumber(managerId) && (managerId || 0) >= 0;
}

class SupportChatScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (state.messages !== props.messages) {
            return {
                messages: props.messages,
                dataProvider: state.dataProvider.cloneWithRows(
                    defArray(
                        _.values(props.messages)
                            .sort(compareFnByInvertedIndex)
                            .reduce(
                                (
                                    array: ListData[],
                                    message: SupportMessage,
                                    index: number,
                                    messages: SupportMessage[],
                                ) => {
                                    array.push({
                                        type: 2,
                                        message,
                                    });
                                    if (index + 1 < messages.length) {
                                        const next: SupportMessage = messages[index + 1];
                                        if (next.manager !== message.manager && (message.manager || '').length > 0) {
                                            array.push({
                                                type: 1,
                                                date: message.date,
                                                name: message.manager,
                                            });
                                        }
                                        if (Moment(next.date).dayOfYear() !== Moment(message.date).dayOfYear()) {
                                            array.push({
                                                type: 0,
                                                date: message.date,
                                            });
                                        }
                                    } else if (index >= messages.length - 1) {
                                        if ((message.manager || '').length > 0) {
                                            array.push({
                                                type: 1,
                                                date: message.date,
                                                name: message.manager,
                                            });
                                        }
                                        array.push({
                                            type: 0,
                                            date: message.date,
                                        });
                                    }
                                    return array;
                                },
                                [],
                            ),
                        [{type: -1}],
                    ),
                ),
            };
        }
        return null;
    }
    updateTimerId: any = null;
    listRef: ?RecyclerListView = null;
    navigationEventListener: any = null;
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    layoutProvider: LayoutProvider = new LayoutProvider(
        (index: number) => this.state.dataProvider.getDataForIndex(index).type,
        (type, dim, index: number) => {
            dim.width = Dimensions.get('window').width;
            if (type < 0) {
                dim.height = 0;
                return;
            }
            if (type <= 1) {
                dim.height = type > 0 ? OPERATOR_NAME_HEIGHT : DATE_ITEM_HEIGHT;
                return;
            }
            const data: ListData = this.state.dataProvider.getDataForIndex(index);
            dim.height = ((data.message || {}).textHeight || EMPTY_ITEM_HEIGHT) + TIME_HEIGHT + 25; // 20 + 5, 5 - spacing;
        },
    );
    mounted: boolean = false;
    state: State = {
        messages: {},
        inputText: '',
        inputHeight: 0,
        largeContent: false,
        fontInfo: {lineHeight: 16},
        dataProvider: new DataProvider(
            (r1, r2) => r1 !== r2 || (r1.message && r2.message && r1.message.textHeight !== r2.message.textHeight),
            (index: number) => {
                const data: ListData = this.state.dataProvider.getDataForIndex(index);
                if (!data) {
                    return `e.${index}`;
                }
                if (data.type < 0) {
                    return `z.${index}`;
                }
                if (data.type <= 1) {
                    return `d.${data.type}.${data.date || 0}`;
                }
                return `m.${(data.message || {}).date || 0}.${((data.message || {}).managerId || 0) > 0 ? 'i' : 'o'}`;
            },
        ).cloneWithRows([{type: -1}]),
    };

    componentDidMount() {
        this.mounted = true;
        this.navigationEventListener = Navigation.events().bindComponent(this);
        RNTextSize.fontFromSpecs(doing.api.support.messageFontSpecs).then(
            (fontInfo: any) => this.mounted && this.setState({fontInfo}),
        );
        doing.api.support.getItemsRequest(1, 100, true).start();
    }

    componentWillUnmount() {
        if (this.updateTimerId !== null) {
            clearInterval(this.updateTimerId);
        }
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
        this.mounted = false;
    }

    componentDidAppear() {
        if (this.updateTimerId !== null) {
            clearInterval(this.updateTimerId);
            this.updateTimerId = null;
        }
        this.updateTimerId = setInterval(this.onRequestUpdates, 20000);
    }

    onRequestUpdates = () => doing.api.support.getItemsRequest(1, 32).start();

    onListRef = (ref: RecyclerListView) => {
        this.listRef = ref;
    };

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
        {useNativeDriver: false},
    );

    onChangeInputHeight = (event: any) =>
        this.mounted && this.setState({inputHeight: event.nativeEvent.contentSize.height});

    onChangeInputText = (text: string) => this.mounted && this.setState({inputText: text});

    onContentSizeChange = (contentWidth, contentHeight) => {
        const {height} = Dimensions.get('window');
        const largeContent = contentHeight > height - BOTTOM_SPACE - NAV_BAR_HEIGHT;
        if (this.state.largeContent !== largeContent) {
            this.mounted &&
                this.setState({
                    largeContent,
                });
        }
    };

    onFocusInput = () => this.listRef && this.listRef.scrollToTop(true);

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onPressSend = () => {
        Keyboard.dismiss();
        doing.api.support
            .sendMessageRequest(this.state.inputText.trim())
            .success(
                () =>
                    this.mounted &&
                    this.setState({
                        inputHeight: 0,
                        inputText: '',
                    }),
            )
            .start();
    };

    rowRenderer = (type: number, data: ListData, index: number) => {
        switch (type) {
            case 0: // Date item:
                const date = Moment(data.date);
                return (
                    <View style={this.props.styles.row}>
                        <View style={this.props.styles.dateHeaderItem}>
                            <Typography>
                                {date.isSame(new Date(), 'day') ? 'Сегодня' : date.format('D MMMM')}
                            </Typography>
                        </View>
                    </View>
                );
            case 1: // Operator name:
                return (
                    <View style={[this.props.styles.row, {alignItems: 'flex-start'}]}>
                        <Typography numberOfLines={1} style={{width: '100%'}}>
                            {data.name}
                        </Typography>
                    </View>
                );
            case 2: // Message item:
                const stableId = this.state.dataProvider.getStableId(index),
                    isIncoming = checkIncomingForManagerId((data.message || {}).managerId);
                return (
                    <View key={`${stableId}.c`} style={this.props.styles.row}>
                        {!isIncoming ? <View style={this.props.styles.rowSpacer} /> : null}
                        <View
                            style={[
                                this.props.styles.messageBlock,
                                {
                                    maxWidth: MAX_MESSAGE_TEXT_WIDTH + 32,
                                },
                                isIncoming
                                    ? this.props.styles.incomingMessageStyle
                                    : this.props.styles.outgoingMessageStyle,
                            ]}>
                            <Text
                                key={stableId}
                                style={[
                                    doing.api.support.messageFontSpecs,
                                    this.props.styles.messageText,
                                    isIncoming ? this.props.styles.messageText : this.props.styles.outgoingMessageText,
                                    {
                                        height: (data.message || {}).textHeight || EMPTY_ITEM_HEIGHT,
                                        lineHeight: (this.state.fontInfo || {}).lineHeight || 16.4,
                                        maxWidth: MAX_MESSAGE_TEXT_WIDTH,
                                    },
                                ]}>
                                {(data.message || {}).text || ''}
                            </Text>
                            <View style={{height: TIME_HEIGHT, justifyContent: 'flex-end'}}>
                                <Typography
                                    fontSize={12}
                                    allowFontScaling={false}
                                    align={isIncoming ? 'left' : 'right'}
                                    style={{width: '100%', opacity: 0.75}}
                                    color={isIncoming ? 'primary' : 'button-caption'}>
                                    {Moment((data.message || {}).date).format('HH:mm')}
                                </Typography>
                            </View>
                        </View>
                        {isIncoming ? <View style={this.props.styles.rowSpacer} /> : null}
                    </View>
                );
            default:
                return null;
        }
    };

    render() {
        const {styles, theme, sending, fetching, isModal} = this.props;
        const hasInputText = this.state.inputText.trim().length > 0;
        return (
            <View testID="support-chat" style={styles.container}>
                <Containers.KeyboardAvoiding style={{flex: 1}} keyboardVerticalOffset={TAB_BAR_HEIGHT + BOTTOM_SPACE}>
                    {this.state.dataProvider.getSize() > 0 ? (
                        <Animatable.View
                            delay={1}
                            isInteraction
                            duration={400}
                            useNativeDriver
                            style={{flex: 1}}
                            animation="fadeIn">
                            <RecyclerListView
                                style={styles.list}
                                ref={this.onListRef}
                                onScroll={this.onScroll}
                                rowRenderer={this.rowRenderer}
                                scrollViewProps={{
                                    scrollsToTop: false,
                                    invertStickyHeaders: true,
                                    pinchGestureEnabled: false,
                                    directionalLockEnabled: true,
                                    contentInsetAdjustmentBehavior: 'never',
                                    automaticallyAdjustContentInsets: false,
                                    contentContainerStyle: styles.listContentContainer,
                                }}
                                renderAheadOffset={Dimensions.get('window').height}
                                onContentSizeChange={this.onContentSizeChange}
                                dataProvider={this.state.dataProvider}
                                layoutProvider={this.layoutProvider}
                            />
                        </Animatable.View>
                    ) : (
                        <View style={{flex: 1}} />
                    )}
                    <View style={styles.inputToolbar}>
                        <TextInput
                            multiline={true}
                            editable={!sending}
                            style={[
                                styles.input,
                                {
                                    height: Math.min(128, Math.max(23, this.state.inputHeight)),
                                    paddingBottom: 2,
                                },
                            ]}
                            onFocus={this.onFocusInput}
                            value={this.state.inputText}
                            onChangeText={this.onChangeInputText}
                            onContentSizeChange={this.onChangeInputHeight}
                            placeholderTextColor={theme.colors.secondaryText}
                            placeholder={i18n.t('support.inputPlaceholder')}
                        />
                        <Animatable.View
                            isInteraction
                            duration={334}
                            useNativeDriver
                            animation={
                                hasInputText
                                    ? {from: {opacity: 0, scale: 0.01}, to: {opacity: 1, scale: 1}}
                                    : {from: {opacity: 1, scale: 1}, to: {opacity: 0, scale: 0.01}}
                            }>
                            <TouchableOpacity
                                disabled={sending || !hasInputText}
                                onPress={this.onPressSend}
                                style={styles.sendButton}
                                rippleCentered>
                                {sending ? (
                                    <ActivityIndicator size="small" color={theme.colors.button} animating />
                                ) : (
                                    <Image
                                        style={styles.sendIcon}
                                        source={require('../../resources/icons/ic-send.png')}
                                    />
                                )}
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </Containers.KeyboardAvoiding>
                <NavBar
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    onPressBack={this.onPressClose}
                    title={i18n.t('support.title')}
                    showBackButton={isModal ? 'close' : true}
                    scrollY={Animated.subtract(this.scrollY, 56)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                    withBottomBorder={this.state.largeContent ? true : 'animated'}
                    rightItems={
                        fetching
                            ? [
                                  {
                                      view: (
                                          <ActivityIndicator color={theme.colors.primaryText} size="small" animating />
                                      ),
                                  },
                              ]
                            : undefined
                    }
                />
            </View>
        );
    }
}

export const navigationName = 'app.SupportChat';
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
                bottomTabs: {
                    animate: true,
                    drawBehind: false,
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    messages: state.support || emptyObject,
    fetching: ReduxUtils.hasFetching(state, [API_SUPPORT_GET_ITEMS]),
    sending: ReduxUtils.hasFetching(state, [API_SUPPORT_SEND_MESSAGE]),
}))(withTheme(SupportChatScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
