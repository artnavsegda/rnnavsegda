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


const App: NavigationFunctionComponent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ position: "absolute" }}>
        <Button title='Map' onPress={() => {
          Navigation.push(props.componentId, {
            component: {
              name: 'Map',
              options: {
                topBar: {
                  title: {
                    text: 'Map'
                  }
                }
              }
            }
          });
        }} />
        <Button title='Modal' onPress={() => {

        }} />
        <Text></Text>
        <Text></Text>
        <Icon name="gps-fixed" size={30} />
      </SafeAreaView>
    </View>
  );
};

App.options = {
  topBar: {
    title: {
      text: 'Home',
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
}

export default App;
