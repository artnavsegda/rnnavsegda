import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';
import { connect, Provider } from "react-redux";
import { StyleSheet, Button, Text, View, Switch, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import styled from "styled-components";
import { Card } from 'react-native-paper';
import Tile from "./components/Tile";
import reducer from "./reducer.js";

function HomeScreen({ navigation }) {
  return (
      <View style={styles.container}>
        <Card>
          <Button
            title="Студия"
            onPress={() => navigation.navigate('Studio')}
          />
          <Button
            title="Переговорная"
            onPress={() => navigation.navigate('Meeting')}
          />
        </Card>
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

function Meeting() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Tile id="3" caption="Потолок" onClick={() => {}}/>
      <Tile id="4" caption="Лампа" />
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
        <Stack.Screen name="Meeting" component={Meeting} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer,applyMiddleware(sagaMiddleware));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
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
