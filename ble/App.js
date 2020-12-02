import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { Text, View, PermissionsAndroid } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Geolocation from '@react-native-community/geolocation';

import store from './store';
import actions from './actions';
import styles from './styles';

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import VendingScreen from './screens/VendingScreen';

const manager = new BleManager();

function StorageScreen() {
  return (
    <View style={styles.container}>
      <Button>Получение</Button>
      <Button>Сдача</Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Button onPress={actions.signOut}>Выход</Button>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Аппараты" component={VendingScreen} />
      <Tab.Screen name="Склад" component={StorageScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

let devices = new Map();
let uuids = [];

function App({ navigation }) {
  const state = useSelector(state => state)

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      store.dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();

    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ])
    .then(permissions => {
      console.log(JSON.stringify(permissions) + "granted");
      function setloc(location)
      {
        console.log(JSON.stringify(location))
        store.dispatch({ type: 'LOCATION', location: location });
      }
      Geolocation.getCurrentPosition(setloc);
      Geolocation.watchPosition(setloc);

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            console.log("BLE ok");
            manager.startDeviceScan(null, null, (error, device) => {
              if (error) {
                  console.log("some kind of BLE error");
                  console.error(error);
                  return
              }
              //console.log("Found: " + device.name + "id: " +  device.id + " UUIDS: " + JSON.stringify(device.serviceUUIDs));
              devices.set(device.id, {name: device.name, uuids: device.serviceUUIDs, lastSeen: Date.now()})
              uuids = [];
              for (let [key, value] of devices) {
                if ((Date.now() - value.lastSeen) < 5000)
                  if (value.uuids)
                    value.uuids.forEach(uuid => uuids.push(uuid))
              }
              //console.log(uuids);
              store.dispatch({ type: 'BEACONS', beacons: uuids });
            });
            subscription.remove();
        }
        else
          console.log("BLE: " + JSON.stringify(state));
      }, true);
    })
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : state.userToken == null ? (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Sign in',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: state.userName }}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function ConnectedApp() {
  return(
    <Provider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </Provider>
  )
}