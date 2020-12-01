import { Alert } from 'react-native';
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
          throw "Login incorrect";
        store.dispatch({ type: 'SIGN_IN', token: response.headers.get('token') });
        return response.json();
      })
      .then(json => {
        store.dispatch({ type: 'USER_NAME', username: json.Name });
      })
      .catch((error) => {
        Alert.alert('Error:', error);
        //console.error('Error:', error);
      });
    },
    signOut: () => store.dispatch({ type: 'SIGN_OUT' })
}

export default actions;