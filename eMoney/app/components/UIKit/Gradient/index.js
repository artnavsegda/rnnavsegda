// @flow
import _ from 'lodash';
import Color from 'color';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Svg, Defs, RadialGradient, LinearGradient, Stop, Rect} from 'react-native-svg';

export type Props = {
    key?: ?string,
    colors: string[],
    type: 'linear' | 'radial',
    locations?: number | string[],
    end?: {x: number | string, y: number | string},
    start?: {x: number | string, y: number | string},
    center?: {x: number | string, y: number | string},
    radius?: {x: number | string, y: number | string} | number | string,
    focal?: {x: number | string, y: number | string, r?: number | string},
    children?: any,
    style?: any,
};

const getLocation = (index: number, fullSize: number, locations?: (number | string)[]): number | string => {
    if (locations && locations.length > index) {
        return locations[Math.max(0, index)];
    }
    return (index + 1) / Math.max(1, fullSize);
};

const getSvgGradientProps = (type: 'linear' | 'radial', {start, end, center, radius, focal}: any): any => {
    if (type === 'radial') {
        //$FlowFixMe
        return {
            ...(center ? {cx: center.x, cy: center.y} : {}),
            ...(focal ? {fx: focal.x, fy: focal.y, ...(focal.r ? {fr: focal.r} : {})} : {}),
            ...(radius ? (_.isObject(radius) ? {rx: radius.x, ry: radius.y} : {r: radius}) : {}),
        };
    }
    //$FlowFixMe
    return {
        ...(start ? {x1: start.x, y1: start.y} : {}),
        ...(end ? {x2: end.x, y2: end.y} : {}),
    };
};

const renderSvgGradient = (type: 'linear' | 'radial', key: ?string, {colors, locations, ...props}: any) => {
    const gradientId = `${type}-grad:${key || 'u'}`;
    const Component = type === 'radial' ? RadialGradient : LinearGradient;
    if (!colors) {
        return null;
    }
    return (
        <Svg height="100%" width="100%">
            <Defs>
                <Component {...getSvgGradientProps(type, props || {})} id={gradientId}>
                    {colors.map((color: string, index: number, array: string[]) => (
                        <Stop
                            offset={getLocation(index, array.length, locations)}
                            stopOpacity={Color(color).valpha || 0}
                            stopColor={color}
                            key={`c.${index}`}
                        />
                    ))}
                </Component>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
    );
};

const Gradient = ({style, key, type, children, ...props}: Props) => (
    <View style={[style, {overflow: 'hidden'}]}>
        <View style={StyleSheet.absoluteFill}>{renderSvgGradient(type, key, props)}</View>
        {children}
    </View>
);

Gradient.defaultProps = {
    type: 'linear',
};

export default Gradient;
