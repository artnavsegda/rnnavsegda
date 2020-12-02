import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { Button, Text, TextInput, View, Alert } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';

import store from './store';
import actions from './actions';
import styles from './styles';

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import VendingScreen from './screens/VendingScreen';

function StorageScreen() {
  return (
    <View style={styles.container}>
      <Text>Storage!</Text>
    </View>
  );
}

function ProfileScreen() {
    return (
      <View style={styles.container}>
        <Button title="Sign out" onPress={actions.signOut} />
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
              title: 'Цех 85',
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
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });

  Location.watchPositionAsync({}, (location) => {
    store.dispatch({ type: 'LOCATION', location: location });
    console.log(JSON.stringify(location));
  })

  return(
    <Provider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </Provider>
  )
}