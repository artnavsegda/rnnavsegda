import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#dff' }}>
      <View style={{
        flex: 1,
        backgroundColor: '#fdf'
      }}>
        <View style={{ backgroundColor: '#ff0', position: 'absolute', left: 10, top: 10 }}>
          <Text>Hello</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}