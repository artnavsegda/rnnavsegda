//@flow
import React from 'react';
import {Image} from 'react-native';

import AccessoryButtonIconSource from '../../../resources/icons/ic-button-accessory.png';

export type Props = {
    variant?: 'button' | any,
    color?: string,
    size?: number,
    style?: any,
};

function getAccessorySource(variant: any): any {
    if (variant === 'button') {
        return AccessoryButtonIconSource;
    }
    return variant;
}

const Accessory = ({variant, style, color, size}: Props) => (
    <Image
        style={[
            style,
            {
                width: size,
                height: size,
                tintColor: color,
            },
        ]}
        resizeMode="contain"
        source={getAccessorySource(variant)}
    />
);

Accessory.defaultProps = {
    variant: 'button',
    color: '#252525',
    size: 14,
};

export default Accessory;
