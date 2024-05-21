import React from 'react';
import {StyleSheet, TouchableOpacity, View, Platform, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from './styles';

/*
-------------------------------------------------------------
 various icon types
-------------------------------------------------------------
*/
const CheckedIcon = (props) => {
    const {color} = props;

    const iconName = Platform.OS === 'ios' ? 'checkbox-marked-circle-outline' : 'checkbox-marked-outline';

    return <MaterialCommunityIcons style={{marginRight: 8}} name={iconName} size={22} color={color} />;
};

const UnchekedIcon = (props) => {
    const {color} = props;

    const iconName = Platform.OS === 'ios' ? 'checkbox-blank-circle-outline' : 'checkbox-blank-outline';

    return <MaterialCommunityIcons style={{marginRight: 8}} name={iconName} size={22} color={color} />;
};

const CheckBox = (props) => {
    const {...rest} = props;

    const {checked, color, title, titleColor, containerStyle, textStyle, onPress, ...attributes} = rest;

    const CheckBoxIcon = checked ? <CheckedIcon color={color} /> : <UnchekedIcon color={color} />;

    return (
        <TouchableOpacity
            {...attributes}
            onPress={onPress}
            style={StyleSheet.flatten([Styles.container, containerStyle && containerStyle])}>
            <View style={Styles.wrapper}>
                {CheckBoxIcon}

                {React.isValidElement(title)
                    ? title
                    : title && (
                          <Text
                              numberOfLines={2}
                              testID="checkboxTitle"
                              style={[Styles.mainText, titleColor && {color: titleColor}]}>
                              {title}
                          </Text>
                      )}
            </View>
        </TouchableOpacity>
    );
};

CheckBox.defaultProps = {
    color: '#004A99',
};

export default CheckBox;
