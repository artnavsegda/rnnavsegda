import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { createHttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({
  uri: 'http://192.168.88.23:4000'
})

const wsLink = new WebSocketLink({
  uri: `ws://192.168.88.23:4000`,
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
      isOn
    }
  }
`

const UPDATE_SUBSCRIPTION = gql`
  subscription {
    lightChange {
        id
        isOn
    }
  }
`

const LightsList = () => {
  const { data, loading, error, subscribeToMore } = useQuery(LIST_QUERY);
  if (loading || error) return <Text>loading</Text>

  subscribeToMore({
    document: UPDATE_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      console.log("prev:" + JSON.stringify(prev));
      console.log("data:" + JSON.stringify(subscriptionData));
      if (!subscriptionData.data) return prev;
      //return "hello";
      //return subscriptionData.data.lightChange.id;
      return prev;
    }
  });

  return (
    <FlatList
      data={data.lights.map(light => {return {key: light.id, text: light.description, value: JSON.stringify(light.isOn)}})}
      renderItem={({item}) => <Text>{item.text}: {item.value}</Text>}
    />
  )
}

const LightSub = () => {
  const { data, loading, error } = useSubscription(UPDATE_SUBSCRIPTION);
  if (loading || error) return <Text>loading sub</Text>
  return <Text>Sub: {data.lightChange.id} : {JSON.stringify(data.lightChange.isOn)}</Text>
}

const ToggleLight = () => {
  const [toggleLight] = useMutation(TOGGLE_MUTATION);

  function shit()
  {
    toggleLight({variables: { id: "light0" }})
  }

  return <Button onPress={shit} title="Push"/>
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        {/* <LightSub /> */}
        <LightsList />
        <ToggleLight />
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
