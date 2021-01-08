import React from 'react';
import { NativeModules, StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions'

const { BeaconModule } = NativeModules;

const MyNativeComp = () => {
  const onPress = () => {
    console.log('We will invoke the native module here!');
    BeaconModule.doSomething(
      'testName',
      'testLocation',
      (eventId) => {
        console.log(`eventid is ${eventId}`);
      }
    );
    console.log("return: " + BeaconModule.getName());
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default function App() {
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <MyNativeComp />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
