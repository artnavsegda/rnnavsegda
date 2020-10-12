import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery, useMutation } from "@apollo/client";
import { createHttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import styled from "styled-components";
import { Card, Title, Paragraph } from 'react-native-paper';

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

const Tab = createMaterialTopTabNavigator();

function Studio() {
  return(
    <Tab.Navigator>
      <Tab.Screen name="Свет" component={StudioLight} />
    </Tab.Navigator>
  )
}

function Meeting() {
  return(
    <Tab.Navigator>
      <Tab.Screen name="Свет" component={MeetingLight} />
    </Tab.Navigator>
  )
}

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
      location
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

const LightsList = (props) => {
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
      data={data.lights
        .filter((roomElement) => roomElement.location == props.room)
        .map(light => {return {key: light.id, text: light.description, value: light.isOn}})}
      renderItem={({item}) =>
        <Container onPress={() => toggleLight({variables: { id: item.key }})} style={ { backgroundColor: `${ item.value ? "#f99" : "#9f9" }` } }>
          <Text>{item.text}</Text>
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <View style={styles.container}>
          <Text>Store</Text>
          <LightsList room="STORE"/>
          <Text>Meeting</Text>
          <LightsList room="MEETING"/>
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
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
