import React, { type PropsWithChildren, useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';


const Modal: NavigationFunctionComponent = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ position: "absolute" }}>
                <Text>Modal</Text>
                <Icon name="gps-fixed" size={30} />
            </SafeAreaView>
        </View>
    );
};

export default Modal;
