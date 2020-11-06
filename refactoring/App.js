import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloProvider } from "@apollo/client";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { client } from './Apollo'
import HomeScreen from './screens/HomeScreen'
import StudioScreen from './screens/StudioScreen'

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Офис">
          <Stack.Screen name="Офис" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Студия" component={StudioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}