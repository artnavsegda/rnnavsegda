// @flow
import React from 'react';
import {View, Animated} from 'react-native';
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';

type Props = ViewProps & {
    animated?: ?boolean,
};

export default ({animated, ...rest}: Props) => (animated ? <Animated.View {...rest} /> : <View {...rest} />);
