import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

export default function App() {
  const [timerID, setTimerId] = useState(0);
  const [suggestions, setSuggestions] = useState("suggestions")
  const [status, setStatus] = useState("ready")

  return (
    <View style={styles.container}>
      <Text>Enter something:</Text>
      <Text>{status}</Text>
      <TextInput
        style={{ width: 150, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={askValue => {
          clearTimeout(timerID)
          setStatus("loading")
          setTimerId(setTimeout(askValueLower => {
            fetch("https://artnavsegda.herokuapp.com/q?ask=" + askValueLower)
            .then(response => {
              if (!response.ok)
                throw new Error("connect failure")
              return response.json()
            })
            .then(variants => {
              setSuggestions(variants.toString())
              setStatus("loaded")
            })
            .catch(error => {
              setStatus('error: ' + error);
            })
          }, 1000, askValue.toLowerCase()))
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
