import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  const [value, onChangeText] = React.useState({
    username: '',
    password: ''
  });

  return (
    <View style={styles.container}>
      <Text>Авторизация</Text>
      <TextInput
        placeholder="Логин"
        style={styles.login}
        onChangeText={text => onChangeText({...value, username: text})}
        value={value.username}
      />
      <TextInput
        placeholder="Пароль"
        secureTextEntry
        style={styles.login}
        onChangeText={text => onChangeText({...value, password: text})}
        value={value.password}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});
