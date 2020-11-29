import * as React from 'react';
import { createStore } from 'redux'
import { Provider, useSelector } from 'react-redux'
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const api = 'https://app.tseh85.com/DemoService/api';
const auth = api + '/AuthenticateVending';
const machines = api + '/vending/machines';

let store = createStore((prevState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  userName: "",
}, action) => {
  switch (action.type) {
    case 'USER_NAME':
      return {
        ...prevState,
        userName: action.username,
      };
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    default:
      return prevState;
  }
})

//store.subscribe(() => console.log(store.getState()))

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

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
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
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

  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        let payload = {
          "Login": data.username,
          "Password": data.password,
        }
        fetch(auth, {
          method: 'POST',
          headers: { 'Content-Type': 'text/json' },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (!response.ok)
            throw new Error('Login incorrect');
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
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
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
    </AuthContext.Provider>
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