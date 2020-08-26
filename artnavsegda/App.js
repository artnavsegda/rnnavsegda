import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import styled from "styled-components";
import Tile from "./components/Tile";

const initialState = {
  1:{
    myLight: false
  },
  2:{
    myLight: false
  }
};

const reducer = (state = initialState, action) => {
  if (typeof state === 'undefined') {
    return 0
  }

  let newstate = {...state};

  switch (action.type) {
    case 'TOGGLE':
      newstate[action.id].myLight = !newstate[action.id].myLight;
      return newstate;
    break;
    case 'ON':
      newstate[action.id].myLight = true;
      return newstate;
    break;
    case 'OFF':
      newstate[action.id].myLight = false;
      return newstate;
    break;
    default:
      return state;
  }
}

function HomeScreen({ navigation }) {
  return (
      <View style={styles.container}>
        <Button
          title="Студия"
          onPress{() => navigation.navigate('Studio')}
        />
      </View>
  );
}

function Studio() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Tile id="1" caption="Потолок" onClick={() => {}}/>
      <Tile id="2" caption="Лампа" />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Studio" component={Studio} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;

const store = createStore(reducer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

var ws = new WebSocket('ws://192.168.88.41:8080');

ws.onopen = () => {
  // connection opened
  //ws.send('something'); // send a message
  console.log("websock open");
};

ws.onmessage = (e) => {
  // a message was received
  console.log(e.data);

  let joinType;
  switch (e.data.charAt(0))
  {
    case 'D':
      joinType = "digital";
    break;
    case 'A':
      joinType = "analog";
    break;
  }
  let join = parseInt(e.data.substr(1,4),10);
  let payloadValue = parseInt(e.data.substr(6,5),10);

  console.log("type: " + joinType + " join: " + join + " value: " + payloadValue);

  if ( payloadValue == 1 )
  {
    store.dispatch({ type: 'ON', id: join });
  }
  else if ( payloadValue == 0 )
  {
    store.dispatch({ type: 'OFF', id: join });
  }

};

ws.onerror = (e) => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};

fetch("http://192.168.88.41:7001/G0001")
.then((response) => response.text())
.then((text) => {
  let value = parseInt(text,10);
  if (value == 0)
  {
    store.dispatch({ type: 'OFF', id: 1 });
  }
  if (value == 1)
  {
    store.dispatch({ type: 'ON', id: 1 });
  }
})
