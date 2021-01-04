import * as React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import styles from '../styles';
import actions from '../actions';
import Logo from '../logo';

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
  
    return (
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
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
        <Button onPress={() => {
            actions.signIn({ username, password })
            setLoading(true)
            setTimeout(()=>{setLoading(false)},10000)
          }}>Вход</Button>
        <ActivityIndicator animating={loading} />
      </KeyboardAvoidingView>
    );
  }