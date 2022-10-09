import React, { type PropsWithChildren, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import YaMap, { Point } from 'react-native-yamap';

YaMap.init('0ea7608d-c007-4bf7-87ac-39877f4e108e');

const App = () => {
  const [point, setPoint] = useState<Point>({
    lat: 59.9342802,
    lon: 30.3350986,
  });
  return (
    <View style={{ flex: 1 }}>
      <YaMap
        onCameraPositionChangeEnd={(e) => {
          setPoint(e.nativeEvent.point);
        }}
        initialRegion={{
          lat: 59.9342802,
          lon: 30.3350986,
        }}
        style={{ flex: 1 }}
      />
      <SafeAreaView style={{ position: "absolute" }}>
        <Text>{point.lat}</Text>
        <Text>{point.lon}</Text>
      </SafeAreaView>
    </View>
  );
};

export default App;
