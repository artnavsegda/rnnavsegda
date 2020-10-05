import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ApolloProvider, Query } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const httpLink = createHttpLink({
  uri: 'http://192.168.88.23:4000'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const LIST_QUERY = gql`
  query {
    lights {
      id
      description
      isOn
    }
  }
`

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Query query={LIST_QUERY} >
        {({ loading, error, data }) => {
              if (loading || error) return <Text>loading</Text>
              return <FlatList
                data={data.lights.map(light => {return {key: light.id, text: light.description, value: JSON.stringify(light.isOn)}})}
                renderItem={({item}) => <Text>{item.text}: {item.value}</Text>}
              />
          }}
        </Query>
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
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
