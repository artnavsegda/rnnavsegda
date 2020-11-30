import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './store.js'

const API_PATH = 'https://app.tseh85.com/DemoService/api';

const api = {
  auth: API_PATH + '/AuthenticateVending',
  machines: API_PATH + '/vending/machines'
}

const actions = {
  signIn: data => {
    let payload = {
      "Login": data.username,
      "Password": data.password,
    }
    fetch(api.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok)
        throw "Login incorrect";
      store.dispatch({ type: 'SIGN_IN', token: response.headers.get('token') });
      return response.json();
    })
    .then(json => {
      store.dispatch({ type: 'USER_NAME', username: json.Name });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },
  signOut: () => store.dispatch({ type: 'SIGN_OUT' })
}

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={actions.signOut} />
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.login}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.login}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => actions.signIn({ username, password })} />
    </View>
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
              title: 'Sign in',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function ConnectedApp() {
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
      width: 150,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 5,
      padding: 5
  }
});