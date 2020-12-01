import * as React from 'react';
import { useSelector } from 'react-redux'
import { Text, View, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import styles from '../styles';
import api from '../api.js';

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function VendingScreen() {
    const state = useSelector(state => state)
    const [data, setData] = React.useState({ isLoading: true, machines: [] });
  
    React.useEffect(() => {
      state.userToken ? fetch(api.machines, {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(json => setData({isLoading: false, machines: json})) : null
    });

    const renderItem = ({ item }) => (
      <Item title={item.Name} />
    );
  
    return (
      data.isLoading ? (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MapView style={{flex: 1}}
            initialRegion={{
              ...state.location.coords,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {data.machines.map((marker, index) => (
              <MapView.Marker
                key={marker.GUID}
                coordinate={{latitude: marker.Latitude, longitude: marker.Longitude}}
                title={marker.Name}
                description={marker.Address}
                onPress={()=>{console.log(marker.GUID)}}
              />
            ))}
          </MapView>
          <View style={{flex: 1}}>
            <FlatList
              data={data.machines}
              renderItem={renderItem}
              keyExtractor={item => item.GUID}
            />
          </View>
        </View>
      )
    );
}