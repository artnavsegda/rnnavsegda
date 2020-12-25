import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { useColorScheme, PermissionsAndroid } from 'react-native'
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
import Geolocation from '@react-native-community/geolocation';

import store from './store'
import actions from './actions'
import styles from './styles'

import SplashScreen from './screens/SplashScreen'
import SignInScreen from './screens/SignInScreen'
import VendingScreen from './screens/VendingScreen'
import StorageScreen from './screens/StorageScreen'
import ServiceScreen from './screens/ServiceScreen'

function CustomNavigationBar({ scene, navigation, previous }) {
  const userToken = useSelector(state => state.userToken)
  const { options } = scene.descriptor;
  const title = options.headerTitle !== undefined
    ? options.headerTitle
    : options.title !== undefined
    ? options.title
    : scene.route.name;

  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      { userToken ? <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }>
        <Menu.Item onPress={actions.signOut} title="Выход" />
      </Menu> : null }
    </Appbar.Header>
  )
}

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Аппараты" component={VendingScreen} />
      <Tab.Screen name="Склад" component={StorageScreen} />
    </Tab.Navigator>
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
              title: 'Цех 85',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : state.servicingMachineID == null ? (
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: state.userName }}/>
        ) : (
          <Stack.Screen name="Service" component={ServiceScreen} options={{ title: "Обслуживание" }}/>
        )}
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