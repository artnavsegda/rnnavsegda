import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Text
} from 'react-native-paper';
import { 
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

const Stack = createStackNavigator();

function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function Main() {
  const scheme = useColorScheme()
  return (
    <PaperProvider>
      <NavigationContainer theme={scheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="App" component={App} />
      </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
/*     backgroundColor: '#fff', */
    alignItems: 'center',
    justifyContent: 'center',
  },
});
