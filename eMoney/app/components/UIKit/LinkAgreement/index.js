import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CheckBox from '../../CheckBox';

import Styles from './styles';

const LinkAgreement = ({...props}) => {
    const {title, linkText, checked, containerStyle, titleStyle, onPress, onLinkPress} = props;

    return (
        <View style={[Styles.container, containerStyle && containerStyle]}>
            <CheckBox
                checked={checked}
                title={
                    <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
                        <Text style={[Styles.mainText, {marginBottom: 4}, titleStyle && titleStyle]}>{title}</Text>
                        <TouchableOpacity onPress={onLinkPress && onLinkPress}>
                            <Text style={[Styles.linkText, {marginLeft: 4}]}>{linkText}</Text>
                        </TouchableOpacity>
                    </View>
                }
                onPress={onPress && onPress}
            />
        </View>
    );
};

export default LinkAgreement;
