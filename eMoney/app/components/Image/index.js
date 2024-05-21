// @flow
import _ from 'lodash';
import React from 'react';
import CachedSvgUri from '../CachedSvgUri';
import {View, Animated, StyleSheet, ActivityIndicator} from 'react-native';
import FastImage, {type FastImageSource, type OnLoadEvent, type OnProgressEvent} from 'react-native-fast-image';

import {exportBorderRadiusStyle} from '../../utils';

export type Props = {
    fallback?: boolean,
    onLoadStart?: () => any,
    source: FastImageSource | number | any,
    errorSource?: FastImageSource | number,
    defaultSource?: FastImageSource | number,
    onProgress?: (event: OnProgressEvent) => any,
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center',
    svgContentScale?: number, // Only for svg
    onLoad?: (event: OnLoadEvent) => any,
    onLayout?: (event: any) => void,
    withoutLoader?: boolean,
    onLoadEnd?: () => any,
    onError?: () => any,
    loaderColor?: any,
    tintColor?: any,
    testID?: string,
    children?: any,
    svgProps?: any,
    style?: any,
};

type State = {
    loading: number, // 0 - default, 1 - loading, -1 - error
    withDefault: boolean,
    borderStyle: any,
    style: any,
};

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

function isSvgSource(source: any): boolean {
    if (_.isObject(source) && 'uri' in source) {
        return (source.uri || '').includes('.svg') || (source.uri || '').includes('/svg');
    }
    return false;
}

class Image extends React.Component<Props, State> {
    // Optimization for border style
    static getDerivedStateFromProps(props: Props, state: State) {
        if (!_.isEqual(state.style, props.style) && !isSvgSource(props.source) && !props.fallback) {
            return {
                style: props.style,
                borderStyle: exportBorderRadiusStyle(props.style),
            };
        }
        return null;
    }
    visible: Animated.Value = new Animated.Value(0);
    state: State = {
        withDefault: true,
        borderStyle: {},
        loading: 0,
        style: {},
    };
    mounted: boolean = false;
    loaded: boolean = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    show = () => {
        Animated.spring(this.visible, {
            useNativeDriver: true,
            toValue: 1,
        }).start(() => {
            this.mounted &&
                this.props.defaultSource &&
                this.setState({
                    withDefault: false,
                });
        });
    };

    onError = () => {
        this.mounted && this.setState({loading: -1}, this.show);
        this.props.onError && this.props.onError();
    };

    onLoadEnd = () => {
        this.loaded = true;
        this.mounted && this.setState({loading: 0}, this.show);
        this.props.onLoadEnd && this.props.onLoadEnd();
    };

    onLoadStart = () => {
        this.visible.setValue(0);
        this.props.onLoadStart && this.props.onLoadStart();
        this.mounted && this.setState({loading: 1});
    };

    render(): any {
        const {
            style,
            onError,
            children,
            svgProps,
            onLoadEnd,
            onLoadStart,
            errorSource,
            loaderColor,
            defaultSource,
            withoutLoader,
            svgContentScale,
            ...rest
        } = this.props;
        if (isSvgSource(rest.source)) {
            return (
                <View style={[style, {alignItems: 'center', justifyContent: 'center'}]}>
                    <CachedSvgUri
                        width="100%"
                        height="100%"
                        {...(svgProps || {})}
                        style={{
                            height: `${Math.floor((svgContentScale || 1) * 100)}%`,
                            width: `${Math.floor((svgContentScale || 1) * 100)}%`,
                        }}
                        source={rest.source}
                    />
                </View>
            );
        }
        if (rest && ((_.isNumber(rest.source) && rest.source !== null) || rest.fallback)) {
            return (
                <FastImage
                    {...rest}
                    style={style}
                    onError={onError}
                    children={children}
                    onLoadEnd={onLoadEnd}
                    onLoadStart={onLoadStart}
                />
            );
        }
        const {loading, withDefault, borderStyle} = this.state;
        return (
            <View style={style}>
                {withDefault && defaultSource ? (
                    <AnimatedFastImage
                        source={defaultSource}
                        fallback={rest.fallback}
                        style={[
                            {opacity: Animated.subtract(1.0, this.visible)},
                            StyleSheet.absoluteFill,
                            this.state.borderStyle,
                        ]}
                    />
                ) : null}
                <AnimatedFastImage
                    {...(rest || {})}
                    onError={this.onError}
                    onLoadEnd={this.onLoadEnd}
                    onLoadStart={this.onLoadStart}
                    style={[{flex: 1, opacity: loading < 0 ? 0 : this.visible}, borderStyle]}
                />
                {this.state.loading < 0 && errorSource ? (
                    <AnimatedFastImage
                        source={errorSource}
                        fallback={rest.fallback}
                        style={[StyleSheet.absoluteFill, {opacity: this.visible}, borderStyle]}
                    />
                ) : null}
                {!withoutLoader && loading > 0 ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="small" color={loaderColor || rest.tintColor || '#252525'} animating />
                    </View>
                ) : null}
                {children ? <View style={StyleSheet.absoluteFill}>{children}</View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Image;
