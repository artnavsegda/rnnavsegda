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
        style={styles.login}
        onChangeText={text => onChangeText(text)}
        value={value}
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
