import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { StyleSheet, Text, View, Switch} from 'react-native';

function mapStateToProps(state) {
  return { action: state.action }
}

const initialState = {

};

const reducer = (state = initialState, action) => {
  return state;
}

export default function App() {
  const toggleSwitch = () => {};
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Switch value={true} />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const store = createStore(reducer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
