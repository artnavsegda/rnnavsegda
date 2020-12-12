import * as React from 'react';
import { useSelector } from 'react-redux'
import { Text, View, FlatList, TouchableOpacity, Dimensions, Linking, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, ActivityIndicator, Colors } from 'react-native-paper';
import MapView from 'react-native-maps';
import styles from '../styles';
import api from '../api.js';
import store from '../store.js';

const Item = ({ item, onPress }) => {
  const state = useSelector(state => state)
  const [loading, setLoading] = React.useState(false);
  const [lock, setLock] = React.useState(false);

  function openLock()
  {
    console.log("Open lock GUID " + item.GUID);
    setLoading(true);
    state.userToken ? fetch(api.openlock + '?' + new URLSearchParams({ MachineGUID: item.GUID }), {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(openlock => {
          console.log("open door: " + JSON.stringify(openlock))
          let timerID = setInterval(function(){
            fetch(api.status + '?' + new URLSearchParams({ MachineGUID: item.GUID }), {headers: { token: state.userToken }})
            .then(response => response.json())
            .then(status => {
              console.log("status: " + JSON.stringify(status))
              if (status.Lock)
              {
                setLoading(false);
                setLock(true);
                item.lockOpen = true;
              }
              else
                setLock(false);

              if (status.Door)
              {
                clearInterval(timerID);
                store.dispatch({ type: 'MACHINE', machine: item.GUID })
              }
            })
          }, 5000);
        }) : null
  }

  return (
    <Card style={styles.item}>
      <TouchableOpacity onPress={onPress}>
        <Card.Title title={item.Name} subtitle={"Время работы: " + item.Start + " - " + item.Finish} />
        <Card.Content>
          {lock ? <Paragraph>Замок открыт, откройте дверь</Paragraph> : <Paragraph />}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {
            Linking.openURL("geo:" + item.Latitude + "," + item.Longitude);
            console.log('Pressed');
          }}>Навигация</Button>
          <Button
            disabled={!state.beacons.includes(item.MACAddress)}
            onPress={openLock}
          >Открыть замок</Button>
          <ActivityIndicator animating={loading} />
        </Card.Actions>
        {/*<Text style={styles.title}>Название: {item.Name}</Text>
        <Text style={styles.title}>Адрес: {item.Address}</Text>
        <Text style={styles.title}>Расстояние: 0000000</Text>
        <Text style={styles.title}>Комментарий: {item.Comment}</Text>
        <Text style={styles.title}>Время работы: {item.Start}-{item.Finish}</Text>
        <Text style={styles.title}>Дата обслуживания: {item.ServiceDate}</Text> */}
        {/* <Button title="Go"/> */}
        {/* <Button title="Открыть замок"/> */}
      </TouchableOpacity>
    </Card>
  )
};

export default function VendingScreen() {
    const state = useSelector(state => state)
    const [data, setData] = React.useState({ isLoading: true, machines: [] });
    const map = React.useRef(null);
    const flatlist = React.useRef(null);
  
    React.useEffect(() => {
      state.userToken ? fetch(api.machines, {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(json => setData({isLoading: false, machines: json})) : null
    });

    const renderItem = ({ item, index }) => (
      <Item item={item} onPress={()=>{
        console.log(item.Name)
        map.current.animateCamera({center: {latitude: item.Latitude, longitude: item.Longitude }, zoom: 15 }, 5000 );
        //flatlist.current.scrollToIndex({animated: true, index})
      }}/>
    );
  
    return (
      data.isLoading ? (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MapView style={{flex: 2}}
            ref={map}
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
                showsMyLocationButton={true}
                onPress={()=>{
                  console.log(marker.GUID)
                  flatlist.current.scrollToIndex({animated: true, index})
                }}
              />
            ))}
          </MapView>
          <FlatList style={{flex: 1}}
            style={{position: 'absolute', bottom: 0}}
            ref={flatlist}
            data={data.machines}
            renderItem={renderItem}
            keyExtractor={item => item.GUID}
            horizontal
            snapToAlignment='start'
            snapToInterval={Dimensions.get('window').width}
          />
        </View>
      )
    );
}