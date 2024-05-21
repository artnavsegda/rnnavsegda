//@flow
import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
        justifyContent: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 8,
        backgroundColor: 'white',
    },
});

export type Props = {
    style?: any,
    dots: number,
    indicatorColor: string,
    indicatorOpacity: number,
    progress: typeof Animated.Value | number,
    indicatorPosition: 'top' | 'right' | 'bottom' | 'left',
};

export default class Indicator extends React.PureComponent<Props> {
    render() {
        const {
            progress,
            dots: dotsCount,
            indicatorColor: backgroundColor,
            indicatorOpacity,
            indicatorPosition,
            style,
            ...rest
        } = this.props;
        const dots = Array.from(new Array(dotsCount), (dotNumber: any, index: number) => {
            const opacity =
                typeof progress === 'number'
                    ? progress === index
                        ? 1
                        : indicatorOpacity
                    : progress.interpolate({
                          inputRange: [index - 1, index, index + 1],
                          outputRange: [indicatorOpacity, 1.0, indicatorOpacity],
                          extrapolate: 'clamp',
                      });
            return <Animated.View style={[styles.dot, {opacity, backgroundColor}]} key={index} />;
        });
        return (
            <View
                {...rest || {}}
                style={[
                    styles.container,
                    {flexDirection: /^(top|bottom)$/.test(indicatorPosition) ? 'row' : 'column'},
                    style,
                ]}>
                {dots}
            </View>
        );
    }
}
