import * as React from 'react';
import { View, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from '../styles';
import actions from '../actions';
import Logo from '../logo';

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    return (
      <View style={styles.container}>
        <Logo />
        <TextInput
          style={styles.login}
          placeholder="Логин"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.login}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign in" onPress={() => actions.signIn({ username, password })} />
      </View>
    );
  }