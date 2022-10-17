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
        <Button title='a' onPress={() => {
          Navigation.push(props.componentId, {
            component: {
              name: 'Settings', // Push the screen registered with the 'Settings' key
              options: { // Optional options object to configure the screen
                topBar: {
                  title: {
                    text: 'Settings' // Set the TopBar title of the new Screen
                  }
                }
              }
            }
          });
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
