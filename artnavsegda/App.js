import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';
import { connect, Provider } from "react-redux";
import { StyleSheet, Button, Text, View, Switch, TouchableOpacity, ImageBackground} from 'react-native';
import Constants from 'expo-constants';
import styled from "styled-components";
import { Card, Title, Paragraph } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import Tile from "./components/Tile";
import reducer from "./reducer.js";

const RoomCard = ({onClick, caption, image}) => (
  <Card onPress={onClick} style={ { margin: 10, borderRadius: 20, overflow: "hidden" } }>
    <ImageBackground source={image} style={ {  } }>
    <View style={ { height: 100 } }/>
      <BlurView intensity={100} style={ {  } }>
        <Card.Title title={caption} />
      </BlurView>
    </ImageBackground>
  </Card>
)

const HomeScreen = ({ navigation })  => (
  <View style={styles.container}>
    <RoomCard onClick={() => navigation.navigate('Studio')} caption="Студия" image={require('./assets/store.jpg')}/>
    <RoomCard onClick={() => navigation.navigate('Meeting')} caption="Переговорная" image={require('./assets/meeting.jpg')}/>
  </View>
)

function Studio() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Tile id="1" caption="Потолок" onClick={() => {}}/>
      <Tile id="2" caption="Лампа" />
      <Tile id="3" caption="Споты" />
      <Tile id="4" caption="Лента" />
    </View>
  );
}

function Meeting() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Tile id="5" caption="Потолок" onClick={() => {}}/>
      <Tile id="6" caption="Лампа" />
      <Tile id="7" caption="Споты 1" />
      <Tile id="7" caption="Споты 2" />
      <Tile id="8" caption="Лента" />
      <Tile id="9" caption="Стол" />
      <Tile id="10" caption="Ниша" />
      <Tile id="11" caption="Софиты" />
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
