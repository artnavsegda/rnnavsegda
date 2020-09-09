import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  const [timerID, setTimerId] = useState(0);
  const [suggestions, setSuggestions] = useState("suggestions");

  return (
    <View style={styles.container}>
      <Text>Enter something:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={askValue => {
          clearTimeout(timerID)
          setTimerId(setTimeout(askValue => {
            fetch("https://artnavsegda.herokuapp.com/q?ask=" + askValue)
            .then(response => response.json())
            .then(variants => setSuggestions(variants.toString()));
          }, 1000, askValue))
        }}
      />
      <Text>{suggestions}</Text>
      <StatusBar style="auto" />
    </View>
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
