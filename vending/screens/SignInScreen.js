import * as React from 'react';
import { TextInput, View, Button } from 'react-native';
import styles from '../styles';
import actions from '../actions';

export default function SignInScreen() {
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