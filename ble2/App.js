import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  DeviceEventEmitter
} from 'react-native';

import Beacons from 'react-native-beacons-manager'

const App = () => {
  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ])
    .then(permissions => {
      console.log(JSON.stringify(permissions) + "granted");
      Beacons.addIBeaconsDetection()
      .then(() => Beacons.addEddystoneUIDDetection())
      .then(() => Beacons.addEddystoneURLDetection())
      .then(() => Beacons.addEddystoneTLMDetection())
      .then(() => Beacons.addAltBeaconsDetection())
      .then(() => Beacons.addEstimotesDetection())
      .catch(error =>
        console.log(`something went wrong during initialization: ${error}`),
      );

      Beacons.BeaconsEventEmitter.addListener(
        'beaconServiceConnected',
        () => {
          console.log('service connected');
        },
      );

    })
  }, []);

  return (
    <View>
      <Text>Hello !</Text>
    </View>
  )
}

export default App;
