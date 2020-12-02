import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { Button, Text, View, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

let devices = new Map();
let uuids = new Set();

function App({ navigation }) {
  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ])
    .then(permissions => {
      console.log(JSON.stringify(permissions) + "granted");

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            console.log("BLE ok");
            manager.startDeviceScan(null, null, (error, device) => {
              if (error) {
                  console.log("some kind of BLE error");
                  console.error(error);
                  return
              }

              if (device.serviceUUIDs)
              {
                device.serviceUUIDs.forEach(value => {
                    uuids.add(value);
                })
              }

              //console.log("Found: " + device.name + " id: " +  device.id + " UUIDS: " + JSON.stringify(device.serviceUUIDs));
              devices.set(device.id, {name: device.name, uuids: device.serviceUUIDs, lastSeen: Date.now()})
/*               console.log("Devices:")
              for (let [key, value] of devices) {
                console.log(key + ' = ' + JSON.stringify(value))
              }
              console.log("Size:" + devices.size) */

              //console.log(uuids);
            });
            subscription.remove();
        }
        else
          console.log("BLE: " + JSON.stringify(state));
      }, true);
    })
  }, []);

  return (
    <View>
        <Text>Hello</Text>
    </View>
  );
}

export default function ConnectedApp() {
  return(
      <App />
  )
}