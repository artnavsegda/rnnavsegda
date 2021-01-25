import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { View, Alert, useColorScheme, NativeModules, NativeEventEmitter, Dimensions, KeyboardAvoidingView } from 'react-native'
import { 
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  Button, Text, Appbar, Menu, TextInput
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

import store from './store'
import actions from './actions'
import styles from './styles'

import CustomNavigationBar from './components/NavBar'

import SplashScreen from './screens/SplashScreen'
import SignInScreen from './screens/SignInScreen'
import VendingScreen from './screens/VendingScreen'
import StorageScreen from './screens/StorageScreen'
import ServiceScreen from './screens/ServiceScreen'

const width = Dimensions.get('window').width;

const { BeaconModule } = NativeModules;

const eventEmitter = new NativeEventEmitter(BeaconModule);

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Аппараты" component={VendingScreen} />
      <Tab.Screen name="Склад" component={StorageScreen} />
    </Tab.Navigator>
  );
}

let subscription;

function BLEScanner() {
  const [udid, setUdid] = React.useState('')
  const [searching, setSearching] = React.useState(false)
  const [searchResult, setSearchResult] = React.useState('Enter UUID')

  const EventBeacon = (event) => {
    console.log("EventBeacon" + JSON.stringify(event) + udid)
    setSearchResult("Found: " + event.name)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Text>{searchResult}</Text>
        <TextInput style={{width: width-50, height: 40, margin: 5}}
          value={udid}
          onChangeText={setUdid}
        />
        <Button disabled={!udid}
          onPress={() => {
          if (searching)
          {
            setSearching(false);
            BeaconModule.stopRangingBeaconsInRegion()
            subscription.remove()
            setSearchResult('Enter UUID')
          }
          else
          {
            setSearching(true);
            setSearchResult("Searching")
            BeaconModule.startRangingBeaconsInRegion(udid)
            subscription = eventEmitter.addListener('EventBeacon', EventBeacon)
          }
        }}>{searching ? "Stop search" : "Start search"}</Button>
    </KeyboardAvoidingView>
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

    bootstrapAsync();
  }, []);

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
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });

  Location.watchPositionAsync({}, (location) => {
    store.dispatch({ type: 'LOCATION', location: location })
    console.log(JSON.stringify(location))
  })

  return(
    <Provider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </Provider>
  )
}