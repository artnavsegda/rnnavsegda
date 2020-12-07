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
      Beacons.detectIBeacons();
      Beacons.startRangingBeaconsInRegion('REGION1')
      .then(()=>{
        console.log(`Beacons ranging started succesfully!`);
      })
      .catch(error => console.error(error));
      DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        console.log('Found beacons!', data.beacons)
      })
    })
  }, []);

  return (
    <View>
      <Text>Hello !</Text>
    </View>
  )
}

export default App;
