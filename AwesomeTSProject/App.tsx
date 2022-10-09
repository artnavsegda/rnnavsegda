import React, { type PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import YaMap from 'react-native-yamap';

const App = () => {
  YaMap.init('0ea7608d-c007-4bf7-87ac-39877f4e108e');

  return (
    <View>
      <YaMap
        onCameraPositionChangeEnd={(e) => {
          console.log(e.nativeEvent.point.lat);
          console.log(e.nativeEvent.point.lon);
        }}
        initialRegion={{
          lat: 59.9342802,
          lon: 30.3350986,
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default App;
