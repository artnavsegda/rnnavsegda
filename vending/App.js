import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { Button, Text, TextInput, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './store';
import actions from './actions';
import styles from './styles';

import SplashScreen from './screens/SplashScreen'

function HomeScreen() {
  const userName = useSelector(state => state.userName)
  return (
    <View style={styles.container}>
      <Text>Welcome in, {userName}</Text>
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
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: state.userName }}/>
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