import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store.js';
import api from './api.js';

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
          throw "Неверный логин или пароль";
        var userToken = response.headers.get('token')
        store.dispatch({ type: 'SIGN_IN', token: userToken })
        AsyncStorage.setItem('userToken', userToken)
        return response.json()
      })
      .then(json => {
        store.dispatch({ type: 'USER_NAME', username: json.Name })
        AsyncStorage.setItem('userName', json.Name)
      })
      .catch((error) => {
        Alert.alert('Ошибка', error.message);
        //console.error('Error:', error);
      });
    },
    signOut: () => {
      store.dispatch({ type: 'SIGN_OUT' })
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userName');
    }
}

export default actions;