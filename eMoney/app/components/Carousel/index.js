//@flow
import _ from 'lodash';
import React from 'react';
import {View, Animated, Keyboard, PanResponder} from 'react-native';

import Indicator from './Indicator';

export type Props = {
    data: any[],
    style?: ?any,
    header?: ?any,
    width: number,
    footer?: ?any,
    loop?: ?boolean,
    index?: ?number,
    space?: ?number,
    itemWidth: number,
    itemHeight: number,
    preloadSize?: number,
    containerStyle?: ?any,
    inactiveScale?: ?number,
    velocityScale?: number,
    inactiveOpacity?: ?number,
    activeItemWidth?: ?number,
    pivot?: ?[number, number],
    activationOffset?: ?number,
    useNativeDriver?: ?boolean,
    onPanResponderGrant?: ?() => any,
    useMoveOutSelectionIndex?: boolean,
    onPanResponderRelease?: ?() => any,
    onChangeIndex?: ?(index: number) => any,
    outAnimatedSelectionIndex?: ?Animated.Value,
    renderItem: (data: any, index: number, pos: number) => any,
};

type State = {
    positionsRange: number[],
    windowIndex: number,
    preloadSize: number,
    dataSize: number,
};

class Carousel extends React.Component<Props, State> {
    static Indicator = Indicator;

    static defaultProps: any = {
        activationOffset: 20,
        inactiveOpacity: 1,
        pivot: [0.5, 0.5],
        inactiveScale: 1,
        loop: false,
        space: 8,
    };

    static getDerivedStateFromProps(props: Props, state: State): any {
        const dataSize: number = props.data.length;
        const preloadSize: number =
            props.preloadSize || Math.max(2, Math.ceil(props.width / (props.itemWidth + (props.space || 0) * 2)));
        const calcTranslateX = (index: number): number =>
            (props.itemWidth + (props.space || 0)) * index +
                (props.width - props.itemWidth) * (props.pivot || [0.5, 0.5])[0] || 0.5;
        if (state.preloadSize !== preloadSize || state.dataSize !== dataSize) {
            const maxDataSize = Math.max(2, dataSize),
                offset = Math.abs(Math.floor(((props.activeItemWidth || props.itemWidth) - props.itemWidth) / 2));
            return {
                dataSize,
                preloadSize,
                positionsRange: [
                    calcTranslateX(maxDataSize) + offset,
                    calcTranslateX(1) + offset,
                    calcTranslateX(0),
                    calcTranslateX(-1) - offset,
                    calcTranslateX(-maxDataSize) - offset,
                ],
                windowIndex: props.loop
                    ? state.windowIndex
                    : Math.max(0, Math.min(state.windowIndex, Math.floor(dataSize / preloadSize))),
            };
        }
        return null;
    }

    lastDeltaX: number = 0;
    state: State = {
        positionsRange: [],
        windowIndex: 0,
        preloadSize: 0,
        dataSize: 0,
    };
    animatedIndex: Animated.Value = new Animated.Value(0);
    moveAnimation: any = null;
    nextIndex: number = 0;
    index: number = 0;

    // Normalization methods
    ni = (i: number) => (i < 0 ? this.props.data.length + i : i);
    // noinspection SpellCheckingInspection
    nmin = (i: number) => (this.props.loop ? i : Math.max(0, i));
    // noinspection SpellCheckingInspection
    nmax = (i: number) => (this.props.loop ? i : Math.max(0, Math.min(this.props.data.length - 1, i)));
    nni = (i: number) => (this.props.loop ? i : Math.min(Math.max(0, i), this.props.data.length - 1));

    moveToIndex = (index: number, fired: boolean = true) => {
        this.nextIndex = index;
        if (this.props.outAnimatedSelectionIndex) {
            this.props.outAnimatedSelectionIndex.setValue(index);
        }
        if (this.moveAnimation !== null) {
            this.moveAnimation.stop();
        }
        this.moveAnimation = Animated.spring(this.animatedIndex, {
            useNativeDriver: _.isBoolean(this.props.useNativeDriver) ? this.props.useNativeDriver || false : true,
            toValue: index,
        });
        this.moveAnimation.start(({finished}) => {
            this.moveAnimation = null;
            finished && fired && this.onChangeIndex(this.ni(Math.round(index) % this.props.data.length));
        });
    };

    // noinspection JSCheckFunctionSignatures
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        if (
            !_.keys(nextProps).reduce((res: boolean, key: any) => {
                if (!res) {
                    return res;
                }
                if (!(key in this.props)) {
                    return false;
                }
                if (key === 'index' && nextProps[key] === this.nextIndex) {
                    return res;
                }
                return res && _.isEqual(nextProps[key], this.props[key]);
            }, true)
        ) {
            return true;
        }
        return !_.isEqual(nextState, this.state);
    }

    getPathForGesture = (gestureState: any): number => {
        const path = this.lastDeltaX - gestureState.dx;
        this.lastDeltaX = gestureState.dx;
        return path || 0;
    };

    onChangeIndex = (index: number) => {
        const {onChangeIndex} = this.props;
        if (onChangeIndex && typeof onChangeIndex === 'function') {
            onChangeIndex(index);
        }
    };

    onChangeAnimatedIndex = (e: {value: number}) => {
        this.index = e.value || 0;
        if (this.state.preloadSize <= 0) {
            return;
        }
        const windowIndex = Math.floor(this.index / this.state.preloadSize);
        if (this.state.windowIndex !== windowIndex) {
            this.setState({windowIndex});
        }
    };

    onPanResponderMove = (evt: any, gestureState: any) => {
        const index =
            (this.index * this.props.itemWidth + this.getPathForGesture(gestureState)) / this.props.itemWidth || 0;
        this.animatedIndex.setValue(index);
        if (this.props.useMoveOutSelectionIndex) {
            if (this.props.outAnimatedSelectionIndex) {
                this.props.outAnimatedSelectionIndex.setValue(index);
            }
        }
    };

    onPanResponderGrant = () => {
        Keyboard.dismiss();
        this.lastDeltaX = 0;
        this.props.onPanResponderGrant && this.props.onPanResponderGrant();
    };

    onPanResponderEnd = (evt: any, gestureState: any) => {
        this.onPanResponderMove(evt, gestureState);
        const next = this.nni(
            Math.floor(
                Math.abs(gestureState.dx) > Math.abs(this.props.activationOffset || 0)
                    ? this.index +
                          (gestureState.dx > 0 ? -0.1 : 1.1) -
                          (_.isUndefined(this.props.velocityScale) ? 1 : this.props.velocityScale || 0) *
                              gestureState.vx
                    : this.index,
            ),
        );
        this.props.onPanResponderRelease && this.props.onPanResponderRelease();
        if (this.index !== next) {
            this.moveToIndex(next);
        }
    };

    panResponder = PanResponder.create({
        // onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: this.onPanResponderMove,
        onPanResponderGrant: this.onPanResponderGrant,
        onPanResponderRelease: this.onPanResponderEnd,
        onPanResponderTerminate: this.onPanResponderEnd,
        onMoveShouldSetPanResponderCapture: (evt: any, gestureState: any) => Math.abs(Math.floor(gestureState.dx)) > 2,
        // onStartShouldSetPanResponder: () => true,
        // onShouldBlockNativeResponder: () => true,
    });

    componentDidMount() {
        this.animatedIndex.addListener(this.onChangeAnimatedIndex);
        if (this.props.outAnimatedSelectionIndex) {
            this.props.outAnimatedSelectionIndex.setValue(this.props.index || 0);
        }
        this.animatedIndex.setValue(this.props.index || 0);
    }

    componentWillUnmount() {
        this.animatedIndex.removeAllListeners();
    }

    calcNextIndex = (index: number): number => {
        if (!this.props.loop) {
            return Math.abs(index);
        }
        const current = this.ni(Math.round(this.index) % this.props.data.length);
        if (index === current) {
            return Math.round(this.index);
        }
        const d0 = index > current ? Math.abs(index - current) : Math.abs(index + this.props.data.length - current),
            d1 = index > current ? Math.abs(index - this.props.data.length - current) : Math.abs(index - current);
        return Math.round(this.index) + (d0 < d1 ? d0 : -d1);
    };

    componentDidUpdate(prevProps: Props) {
        if (
            _.isNumber(this.props.index) &&
            Math.floor(this.props.index || 0) !== Math.floor(prevProps.index || 0) &&
            Math.floor(this.props.index || 0) !== this.ni(Math.floor(this.index) % this.props.data.length)
        ) {
            const next = this.calcNextIndex(Math.floor(this.props.index || 0));
            if (next !== this.index) {
                this.moveToIndex(next, false);
            }
        }
    }

    renderItemContainer = (data: any, index: number, pos: number, dataSize: number): any => {
        const translateX = this.animatedIndex.interpolate({
            inputRange: [Math.min(pos - 2, pos - dataSize), pos - 1, pos, pos + 1, Math.max(pos + 2, pos + dataSize)],
            outputRange: this.state.positionsRange,
        });
        const scale =
            this.props.inactiveOpacity !== 1
                ? this.animatedIndex.interpolate({
                      inputRange: [pos - 1, pos, pos + 1],
                      outputRange: [this.props.inactiveScale, 1, this.props.inactiveScale],
                  })
                : 1;
        const opacity =
            this.props.inactiveOpacity !== 1
                ? this.animatedIndex.interpolate({
                      inputRange: [pos - 1, pos, pos + 1],
                      outputRange: [this.props.inactiveOpacity, 1, this.props.inactiveOpacity],
                  })
                : 1;
        return (
            <Animated.View
                key={`${index}:${pos}`}
                style={{
                    opacity,
                    position: 'absolute',
                    justifyContent: 'center',
                    width: this.props.itemWidth,
                    height: this.props.itemHeight,
                    transform: [{translateX}, {scale}],
                }}>
                {this.props.renderItem(data, index, pos)}
            </Animated.View>
        );
    };

    renderItems = () => {
        const c: number = Math.floor(this.state.windowIndex * this.state.preloadSize + this.state.preloadSize * 0.5),
            min: number = this.nmin(Math.floor(c - this.state.preloadSize * 1.5)),
            max: number = this.nmax(Math.ceil(c + this.state.preloadSize * 1.5));

        let r: any[] = [];
        for (let i = min; i <= max; i++) {
            const index = this.ni(i % this.props.data.length);
            r.push(this.renderItemContainer(this.props.data[index], index, i, this.props.data.length));
        }
        return r;
    };

    render() {
        const {style, containerStyle, width, itemHeight, header, footer} = this.props;
        return (
            <View style={[style, {width}]}>
                {this.props.data.length > 0 ? (
                    <>
                        {_.isFunction(header) && header ? header() : header}
                        <View
                            style={[
                                containerStyle,
                                {
                                    width: '100%',
                                    height: itemHeight,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                },
                            ]}
                            {...this.panResponder.panHandlers}>
                            {this.renderItems()}
                        </View>
                        {_.isFunction(footer) && footer ? footer() : footer}
                    </>
                ) : null}
            </View>
        );
    }
}

export default Carousel;
