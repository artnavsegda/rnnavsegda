import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { TextInput, View, Alert, useColorScheme } from 'react-native'
import { 
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  Button, Text, Appbar, Menu
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

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
  return (
    <View style={styles.container}>
        <Text>BLE!</Text>
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
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync({}, (location) => {
        store.dispatch({ type: 'LOCATION', location: location })
        console.log(JSON.stringify(location))
      })
    })();
  }, []);

  return(
    <Provider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </Provider>
  )
}