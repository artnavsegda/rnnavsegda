import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#f0f' }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          backgroundColor: '#0ff'
        }}>
          <View style={{ backgroundColor: '#ddf', flex: 1 }} />
          <View style={{ backgroundColor: '#ff0', position: 'absolute', left: 10, top: 10 }}>
            <Text>Hello</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}