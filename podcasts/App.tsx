import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import { FlatList, Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';

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

const soundObject = new Audio.Sound();
async function audioPlay(source)
{
  const status = await soundObject.getStatusAsync();
  console.log(status);

  if (status.isLoaded && source.includes(status.uri))
  {
    console.log("play/pause");
    if (status.isPlaying)
      await soundObject.pauseAsync();
    else
      await soundObject.playAsync();
  }
  else
  {
    await soundObject.unloadAsync();
    await soundObject.loadAsync({uri:source});
    await soundObject.playAsync();
  }
}

function EpisodeList(props)
{
  const renderItem = ({ item }) => (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>{item.title}</Text>
      <Button title="PlayPause" onPress={() => {
        audioPlay(item.enclosure_url);
      }}/>
    </View>
  );
  return (
    <View>
      {props.episodesLoading ? <Text>Loading...</Text>
      : <FlatList 
        data={props.episodes.collection}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />}
    </View>
  )
}

const ConnectedEpisodeList = connect((state) => {
  console.log(state);
  return state;
})(EpisodeList);

const authKey = 'eyJhcGlfa2V5IjoiNzVkMzc3N2M3NWFhM2QwOTkxOWEyZTI4ZjhiM2M1YTkifQ==';

function PodcastList(props) {
  useEffect(() => {
    props.dispatch(fetchPodcasts(authKey))
  }, [])

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      props.navigation.navigate('Эпизоды')
      props.dispatch(fetchEpisodes(item.id))
    }} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
      <Image style={{width: 100, height: 100}} source={{uri: item.image_url}}/>
      <Text style={{textAlignVertical: 'center', fontSize: 20}}>{item.title}</Text>
    </TouchableOpacity>
  );
  return (
    <View >
      {props.loading ? <Text>Loading...</Text>
      : <FlatList 
        data={props.podcasts.collection}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      }
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
