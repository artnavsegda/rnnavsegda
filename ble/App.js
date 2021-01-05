import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { View, FlatList, useColorScheme, PermissionsAndroid } from 'react-native'
import { 
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  Button, Text, Appbar, Menu, DataTable, ActivityIndicator
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Geolocation from '@react-native-community/geolocation';

import store from './store'
import actions from './actions'
import styles from './styles'
import manager from './ble'

import SplashScreen from './screens/SplashScreen'
import SignInScreen from './screens/SignInScreen'
import VendingScreen from './screens/VendingScreen'
import StorageScreen from './screens/StorageScreen'
import ServiceScreen from './screens/ServiceScreen'

import CustomNavigationBar from './components/NavBar'

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Аппараты" component={VendingScreen} />
      <Tab.Screen name="Склад" component={StorageScreen} />
    </Tab.Navigator>
  );
}

function BLEScanner() {
  const [myMap, setMyMap] = React.useState(new Map());
  const [scanning, setScanning] = React.useState(false);

  function scan_stop()
  {
    setScanning(false);
    manager.stopDeviceScan()
  }

  function scan_start()
  {
    scan_stop();
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error)
        return
      }
      console.log("Found: " + device.name + "id: " +  device.id)
      setMyMap(new Map(myMap.set(device.id, {name: device.name, lastSeen: Date.now()})))
    });

    setTimeout(()=>{
      scan_stop();
    },60000)
  }

  return (
    <View>
      <View style={{flexDirection: "row"}}>
      <Button onPress={scan_start}>Start scan</Button>
      <Button onPress={scan_stop}>Stop scan</Button>
      <ActivityIndicator animating={scanning} />
      </View>
      <DataTable>
      <DataTable.Header>
        <DataTable.Title>MAC</DataTable.Title>
        <DataTable.Title>Name</DataTable.Title>
        <DataTable.Title>Date</DataTable.Title>
      </DataTable.Header>
      {[...myMap.keys()].map(k => {
        let d = new Date(myMap.get(k).lastSeen);
        return (
          <DataTable.Row key={k}>
            <DataTable.Cell>{k}</DataTable.Cell>
            <DataTable.Cell>{myMap.get(k).name}</DataTable.Cell>
            <DataTable.Cell>{d.getHours()}:{d.getMinutes()}:{d.getSeconds()}</DataTable.Cell>
          </DataTable.Row>
          )
      })}
      </DataTable>
    </View>
  );
}

const Stack = createStackNavigator();

function App({ navigation }) {
  const scheme = useColorScheme()
  const state = useSelector(state => state)

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken, userName;

      try {
        userToken = await AsyncStorage.getItem('userToken')
        userName = await AsyncStorage.getItem('userName')
      } catch (e) {
        // Restoring token failed
      }

      store.dispatch({ type: 'RESTORE_TOKEN', token: userToken, username: userName })
    };

    bootstrapAsync()
    
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ])
    .then(permissions => {
      console.log(JSON.stringify(permissions) + "granted")
      function setloc(location)
      {
        store.dispatch({ type: 'LOCATION', location: location })
      }
      Geolocation.getCurrentPosition(setloc)
      Geolocation.watchPosition(setloc)

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            subscription.remove()
        }
        else
          console.log("BLE: " + JSON.stringify(state))
      }, true)
    })
  }, [])

  return (
    <NavigationContainer theme={scheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}>
      <Stack.Navigator screenOptions={{ header: (props) => <CustomNavigationBar {...props} /> }}>
        {state.isLoading ? (
          <Stack.Screen name="Загрузка..." component={SplashScreen} />
        ) : state.userToken == null ? (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Холодильник МиниЦЕХ',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : state.servicingMachineID == null ? (
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: state.userName }}/>
        ) : (
          <Stack.Screen name="Service" component={ServiceScreen} options={{ title: "Обслуживание" }}/>
        )}
        <Stack.Screen name="BLE Scanner" component={BLEScanner} />
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