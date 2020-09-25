import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
    <RoomCard onClick={() => navigation.navigate('Студия')} caption="Студия" image={require('./assets/store.jpg')}/>
    <RoomCard onClick={() => navigation.navigate('Переговорная')} caption="Переговорная" image={require('./assets/meeting.jpg')}/>
  </View>
)

function StudioLight() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Tile id="Store.Ceiling" caption="Потолок" onClick={() => {}}/>
      <Tile id="Store.Phytolamp" caption="Лампа" />
      <Tile id="Store.Spotlights" caption="Споты" />
      <Tile id="Store.Ledstrip" caption="Лента" />
    </View>
  );
}

function StudioShades() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Tile caption="Левая" />
      <Tile caption="Правая" />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function Studio() {
  return(
    <Tab.Navigator>
      <Tab.Screen name="Свет" component={StudioLight} />
      <Tab.Screen name="Шторы" component={StudioShades} />
    </Tab.Navigator>
  )
}

function Meeting() {
  return(
    <Tab.Navigator>
      <Tab.Screen name="Свет" component={MeetingLight} />
      <Tab.Screen name="Шторы" component={MeetingShades} />
    </Tab.Navigator>
  )
}

function MeetingLight() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Tile id="Meeting.Ceiling" caption="Потолок" onClick={() => {}}/>
      <Tile id="Meeting.Phytolamp" caption="Лампа" />
      <Tile id="Meeting.Spotlights" caption="Споты 1" />
      <Tile id="Meeting.Spotlights.2" caption="Споты 2" />
      <Tile id="Meeting.Ledstrip" caption="Лента" />
      <Tile id="Meeting.Table" caption="Стол" />
      <Tile id="Meeting.Recess" caption="Ниша" />
      <Tile id="Meeting.Stagelights" caption="Софиты" />
    </View>
  );
}

function MeetingShades() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Tile caption="Шторы" />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Офис" component={HomeScreen} />
        <Stack.Screen name="Студия" component={Studio} />
        <Stack.Screen name="Переговорная" component={Meeting} />
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
  let payloadValue = !!parseInt(e.data.substr(6,5),10);

  console.log("type: " + joinType + " join: " + join + " value: " + payloadValue);

  if (joinType == "digital")
  {
    switch (join)
    {
      case 1:
        store.dispatch({ type: 'SET', id: "Store.Ceiling", payload: payloadValue });
      break;
      case 3:
        store.dispatch({ type: 'SET', id: "Store.Phytolamp", valpayloadue: payloadValue });
      break;
      case 5:
        store.dispatch({ type: 'SET', id: "Meeting.Ceiling", payload: payloadValue });
      break;
      case 7:
        store.dispatch({ type: 'SET', id: "Meeting.Phytolamp", payload: payloadValue });
      break;
      case 9:
        store.dispatch({ type: 'SET', id: "Meeting.Recess", payload: payloadValue });
      break;
      case 11:
        store.dispatch({ type: 'SET', id: "Meeting.Stagelights", payload: payloadValue });
      break;
      case 13:
        store.dispatch({ type: 'SET', id: "Store.Spotlights", payload: payloadValue });
      break;
      case 15:
        store.dispatch({ type: 'SET', id: "Meeting.Spotlights", payload: payloadValue });
      break;
      case 17:
        store.dispatch({ type: 'SET', id: "Meeting.Spotlights.2", payload: payloadValue });
      break;
      case 19:
        store.dispatch({ type: 'SET', id: "Meeting.Table", payload: payloadValue });
      break;
      case 21:
        store.dispatch({ type: 'SET', id: "Store.Ledstrip", payload: payloadValue });
      break;
      case 23:
        store.dispatch({ type: 'SET', id: "Meeting.Ledstrip", payload: payloadValue });
      break;
    }
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
