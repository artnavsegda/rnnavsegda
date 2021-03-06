import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button
            onPress={() => navigation.navigate('Студия')}
            title="Студия"
        />
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

export default HomeScreen;