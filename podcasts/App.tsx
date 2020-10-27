import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Button, StyleSheet, Text, View } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import reducer from './reducer';
import { watchFetchPodcasts, watchFetchEpisodes } from './sagas'
import {fetchPodcasts, fetchEpisodes} from './actions'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(watchFetchPodcasts)
sagaMiddleware.run(watchFetchEpisodes)

function EpisodeList(props)
{
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.id}</Text>
    </View>
  );
  return (
    <View>
      <FlatList 
        data={props.episodes.collection}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const ConnectedEpisodeList = connect((state) => {
  console.log(state);
  return state;
})(EpisodeList);

const authKey = 'eyJhcGlfa2V5IjoiNzVkMzc3N2M3NWFhM2QwOTkxOWEyZTI4ZjhiM2M1YTkifQ==';

function PodcastList(props) {
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.id}</Text>
      <Button title="List" onPress={() => {
        props.navigation.navigate('Эпизоды')
        props.dispatch(fetchEpisodes(item.id))
      }}/>
    </View>
  );
  return (
    <View style={styles.container}>
      <Button onPress={() => props.dispatch(fetchPodcasts(authKey))} title="Load"/>
      <FlatList 
        data={props.podcasts.collection}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const ConnectedPodcastList = connect((state) => {
  console.log(state);
  return state;
})(PodcastList);

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Подкасты" component={ConnectedPodcastList} />
          <Stack.Screen name="Эпизоды" component={ConnectedEpisodeList} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
