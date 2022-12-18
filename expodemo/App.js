import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        backgroundColor: '#fff'
      }}>
        <View style={{ backgroundColor: '#ff0' }}>
          <Text>Hello</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}