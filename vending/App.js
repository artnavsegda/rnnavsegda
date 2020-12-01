import React from 'react';
import MapView from 'react-native-maps';
import { FlatList, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';

const DATA = [
    {
        "GUID": "3759198D-AC56-404F-90D5-69B8A356BC0C",
        "Name": "Большой пр., В.О., д. 25",
        "Address": "Большой пр., В.О., д. 25",
        "Latitude": 59.9393920000000000,
        "Longitude": 30.2817980000000000,
        "IBeaconUDID": "26BA618F-822D-4C13-8CDD-214D7E0A5E32",
        "Start": "08:00:00",
        "Finish": "22:00:00",
        "Comment": null,
        "ServiceDate": null
    },
    {
        "GUID": "6715DBAD-871B-4B4D-B8B3-C3F8685CC47D",
        "Name": "22-я линия В.О., д. 5",
        "Address": "22-я линия В.О., д. 5",
        "Latitude": 59.9326280000000000,
        "Longitude": 30.2640640000000000,
        "IBeaconUDID": "7594C00E-E9BB-4DF0-8C4E-8504E36F93AE",
        "Start": "08:00:00",
        "Finish": "22:00:00",
        "Comment": null,
        "ServiceDate": null
    },
    {
        "GUID": "128857A3-D543-4E20-843A-8F2D167BD46B",
        "Name": "ул. Воскова, д. 27",
        "Address": "ул. Воскова, д. 27",
        "Latitude": 59.9582040000000000,
        "Longitude": 30.3106380000000000,
        "IBeaconUDID": "EDD91461-C91D-48FE-B0DD-5F2857598B86",
        "Start": "08:00:00",
        "Finish": "22:00:00",
        "Comment": null,
        "ServiceDate": null
    }
]

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function App() {
  const renderItem = ({ item }) => (
    <Item title={item.Name} />
  );

  return (
    <View style={{flex: 1}}>
      <MapView style={{flex: 1}}>
        {DATA.map((marker, index) => (
          <MapView.Marker
            key={marker.GUID}
            coordinate={{latitude: marker.Latitude, longitude: marker.Longitude}}
            title={marker.Name}
            description={marker.Address}
          />
        ))}
      </MapView>
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.GUID}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
