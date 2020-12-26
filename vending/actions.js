import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store.js';
import api from './api.js';

const actions = {
    signIn: async data => {
      let payload = {
        "Login": data.username,
        "Password": data.password,
      }
      try {
        let response = await fetch(api.auth, {
          method: 'POST',
          headers: { 'Content-Type': 'text/json' },
          body: JSON.stringify(payload)
        })
        if (!response.ok)
          throw new Error("Неверный логин или пароль:" + await response.text())
        let userToken = response.headers.get('token')
        store.dispatch({ type: 'SIGN_IN', token: userToken })
        AsyncStorage.setItem('userToken', userToken)
        let json = await response.json()
        store.dispatch({ type: 'USER_NAME', username: json.Name })
        AsyncStorage.setItem('userName', json.Name)
      } catch (error) {
        Alert.alert('Ошибка', error.message);
      }
    },
    signOut: () => {
      store.dispatch({ type: 'SIGN_OUT' })
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userName');
    },
    debugToggle: () => {
      store.dispatch({ type: 'DEBUG_TOGGLE' })
    }
}

export default actions;