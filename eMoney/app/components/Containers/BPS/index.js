// @flow
import React from 'react';
import {elevationStyle} from '../../../themes';
import * as Animatable from 'react-native-animatable';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import KeyboardAvoidingContainer from '../KeyboardAvoiding';
import {NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '../../../constants';
import type {LayoutEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {
    View,
    Platform,
    Animated,
    Keyboard,
    Dimensions,
    StyleSheet,
    BackHandler,
    TouchableWithoutFeedback,
} from 'react-native';

export type Props = {
    testID?: string,
    children?: any,
    styles?: {
        panel?: any,
        backdrop?: any,
        container?: any,
    },
    onPressBackdrop?: any,
    showDuration?: number,
    contentHeight?: number,
    minContentHeight?: number,
    contentContainerStyle?: any,
    keyboardVerticalOffset?: number,
    useHardwareBackHandler?: boolean,
};

const _emptyStyles: any = {};

const _styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: STATUS_BAR_HEIGHT + 1,
    },
    backdrop: {
        flex: 1,
    },
    background: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
    },
    panel: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        minHeight: 56 + getBottomSpace(),
        ...elevationStyle(-10, 'rgba(0,0,0,0.6)'),
    },
    bottomSpace: {
        height: getBottomSpace() + 12,
    },
});

export default class BPSContainer extends React.PureComponent<Props> {
    _panelHeight: Animated.Value = new Animated.Value(32);
    _panelContainerRef: ?KeyboardAvoidingContainer = null;
    _backdropBackgroundRef: ?Animatable.View = null;
    _panelWrapperRef: ?Animatable.View = null;
    _backHandlerListener: any = null;
    _layout: any = null;

    componentDidMount() {
        // noinspection JSUnresolvedFunction
        this._panelHeight.setValue(this._calcPanelHeight(this.props));
        if (this.props.useHardwareBackHandler) {
            this._backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.onPressBackdrop);
        }
    }

    componentWillUnmount() {
        if (this._backHandlerListener !== null) {
            this._backHandlerListener.remove();
        }
    }

    // noinspection JSCheckFunctionSignatures
    componentDidUpdate(prevProps: Props) {
        if ((this.props.contentHeight || 0) <= 0) {
            return;
        }
        const height = this._calcPanelHeight(this.props),
            prevHeight = this._calcPanelHeight(prevProps);

        if (height !== prevHeight) {
            Animated.timing(this._panelHeight, {
                useNativeDriver: false,
                toValue: height,
                duration: 225,
            }).start();
        }
    }

    _calcPanelHeight = ({minContentHeight, contentHeight}): number =>
        Math.max(
            minContentHeight || 172 + NAV_BAR_HEIGHT,
            Math.min(
                Dimensions.get('window').height - STATUS_BAR_HEIGHT - NAV_BAR_HEIGHT - getBottomSpace() - 12,
                contentHeight || 0,
            ),
        );

    onPanelWrapperRef = (ref: any) => (this._panelWrapperRef = ref);
    onPanelContainerRef = (ref: any) => (this._panelContainerRef = ref);
    onBackdropBackgroundRef = (ref: any) => (this._backdropBackgroundRef = ref);

    onPressBackdrop = (): any => {
        if (this._panelContainerRef && this._panelContainerRef._keyboardVisible) {
            // noinspection JSUnresolvedFunction
            return Keyboard.dismiss();
        }
        if (Platform.OS === 'android' && this._layout && Math.floor(this._layout.y || 0) <= 0) {
            if (Math.floor(this._layout.height / 20) !== Math.floor(Dimensions.get('window').height / 20)) {
                // noinspection JSUnresolvedFunction
                return Keyboard.dismiss();
            }
        }
        this.props.onPressBackdrop && this.props.onPressBackdrop();
    };

    onLayout = (e: LayoutEvent) => (this._layout = e.nativeEvent.layout);

    hide = (duration: number = 250): Promise<any> =>
        Promise.all([
            this._panelWrapperRef ? this._panelWrapperRef.fadeOutDown(duration) : Promise.resolve(),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    this._backdropBackgroundRef
                        ? this._backdropBackgroundRef
                              .fadeOut(Math.ceil(duration * 0.6))
                              .then(resolve)
                              .catch(reject)
                        : resolve();
                }, Math.floor(duration * 0.4));
            }),
        ]);

    render() {
        const {testID, children, styles, contentHeight, contentContainerStyle, keyboardVerticalOffset} = this.props;
        return (
            <View
                testID={testID}
                onLayout={this.onLayout}
                style={[_styles.container, (styles || _emptyStyles).container]}>
                <Animatable.View
                    duration={334}
                    useNativeDriver
                    animation="fadeIn"
                    ref={this.onBackdropBackgroundRef}
                    style={[(styles || _emptyStyles).backdrop, _styles.background]}
                />
                <TouchableWithoutFeedback onPress={this.onPressBackdrop}>
                    <View style={_styles.backdrop} />
                </TouchableWithoutFeedback>
                <Animatable.View
                    duration={334}
                    useNativeDriver
                    animation="slideInUp"
                    ref={this.onPanelWrapperRef}
                    style={[_styles.panel, (styles || _emptyStyles).panel]}>
                    <KeyboardAvoidingContainer
                        ref={this.onPanelContainerRef}
                        style={[
                            contentContainerStyle,
                            (contentHeight || 0) > 0
                                ? {
                                      height: this._panelHeight,
                                      flex: undefined,
                                  }
                                : undefined,
                        ]}
                        keyboardVerticalOffset={(keyboardVerticalOffset || 0) + getBottomSpace()}>
                        {children}
                        <View style={_styles.bottomSpace} />
                    </KeyboardAvoidingContainer>
                </Animatable.View>
            </View>
        );
    }
}
