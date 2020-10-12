import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery, useMutation } from "@apollo/client";
import { createHttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import styled from "styled-components";

const httpLink = createHttpLink({
  uri: 'http://192.168.0.113:4000'
})

const wsLink = new WebSocketLink({
  uri: `ws://192.168.0.113:4000`,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: link,
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

const TOGGLE_MUTATION = gql`
  mutation toggle($id: ID!) {
    toggle(id: $id)
    {
      id
      description
      isOn
    }
  }
`

const UPDATE_SUBSCRIPTION = gql`
  subscription {
    lightChange {
        id
        description
        isOn
    }
  }
`

const LightsList = () => {
  const [toggleLight] = useMutation(TOGGLE_MUTATION);
  const { data, loading, error, subscribeToMore } = useQuery(LIST_QUERY);
  if (loading || error) return <Text>loading</Text>

  subscribeToMore({
    document: UPDATE_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      let result = Object.assign({}, prev);
      let tIndex = prev.lights.findIndex(element => {return element.id == subscriptionData.data.lightChange.id})
      result.lights[tIndex] = subscriptionData.data.lightChange;
      return result;
    }
  });

  return (
    <FlatList numColumns={2}
      data={data.lights.map(light => {return {key: light.id, text: light.description, value: light.isOn}})}
      renderItem={({item}) =>
        <Container onPress={() => toggleLight({variables: { id: item.key }})} style={ { backgroundColor: `${ item.value ? "#f99" : "#9f9" }` } }>
          <Text>{item.text}: {JSON.stringify(item.value)}</Text>
        </Container>
      }
    />
  )
}

const Container = styled.TouchableOpacity`
  margin: 10px;
  background: gray;
  width: 100px;
  height: 100px;
  border-radius: 14px;
`;

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        {/* <LightSub /> */}
        <LightsList />
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
