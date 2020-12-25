import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import styles from '../styles';

export default function SplashScreen() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
      </View>
    );
}