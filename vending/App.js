import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { TextInput, View, Alert } from 'react-native'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
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

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

import store from './store'
import actions from './actions'
import styles from './styles'

import SplashScreen from './screens/SplashScreen'
import SignInScreen from './screens/SignInScreen'
import VendingScreen from './screens/VendingScreen'
import StorageScreen from './screens/StorageScreen'
import ServiceScreen from './screens/ServiceScreen'

function CustomNavigationBar() {
  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  
  return (
    <Appbar.Header>
      <Appbar.Content title="My awesome app" />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }>
        <Menu.Item onPress={() => {console.log('Option 1 was pressed')}} title="Option 1" />
        <Menu.Item onPress={() => {console.log('Option 2 was pressed')}} title="Option 2" />
        <Menu.Item onPress={() => {console.log('Option 3 was pressed')}} title="Option 3" disabled />
      </Menu>
    </Appbar.Header>
  )
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
      <Stack.Navigator>
        {state.isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
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