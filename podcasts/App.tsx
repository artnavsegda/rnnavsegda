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
import watchFetchPodcasts from './sagas';
import fetchPodcasts from './actions';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(watchFetchPodcasts)

function EpisodeList(props)
{
  return (
    <Text>Episode List</Text>
  )
}

function PodcastList(props) {
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.id}</Text>
      <Button title="List" onPress={() => props.navigation.navigate('Эпизоды')}/>
    </View>
  );
  return (
    <View style={styles.container}>
      <Button onPress={() => props.dispatch(fetchPodcasts())} title="Load"/>
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
          <Stack.Screen name="Эпизоды" component={EpisodeList} />
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
