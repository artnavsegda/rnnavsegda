import * as React from 'react'
import { useSelector } from 'react-redux'
import { Text, View, FlatList, TouchableOpacity, Dimensions, Linking, Alert, Platform } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph, ActivityIndicator, Colors } from 'react-native-paper'
import MapView from 'react-native-maps'
import { getDistance } from 'geolib';

import styles from '../styles'
import api from '../api.js'
import store from '../store.js'
import actions from '../actions'

const Item = ({ item, onPress }) => {
  const state = useSelector(state => state)
  const [loading, setLoading] = React.useState(false)
  const [lock, setLock] = React.useState(false)

  function openLock()
  {
    console.log("Open lock GUID " + item.GUID);
    setLoading(true);
    state.userToken ? fetch(api.openlock + '?' + new URLSearchParams({ MachineGUID: item.GUID }), {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(openlock => {
          console.log("open door: " + JSON.stringify(openlock))
          if (openlock.Result != 0) {
            throw new Error(openlock.ErrorMessage);
          }
          setLoading(false)
          setLock(true)

          let timerID = setInterval(function(){
            fetch(api.status + '?' + new URLSearchParams({ MachineGUID: item.GUID }), {headers: { token: state.userToken }})
            .then(response => response.json())
            .then(status => {
              console.log("status: " + JSON.stringify(status))

              if (status.Door)
              {
                clearInterval(timerID)
                store.dispatch({ type: 'MACHINE', machine: item.GUID })
              }
              else if (!status.Lock)
              {
                clearInterval(timerID)
                setLock(false)
              }
            })
          }, 5000)
        })
        .catch((error) => Alert.alert('Холодильник занят', error.message)) : null
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
            Linking.openURL(Platform.select({ ios: 'maps:q=', android: 'geo:0,0?q=' }) + item.Latitude + "," + item.Longitude)
            console.log('Pressed')
          }}>Навигация</Button>
          <Button
            disabled={lock}
            onPress={openLock}
          >Открыть замок</Button>
          <ActivityIndicator animating={loading} />
        </Card.Actions>
      </TouchableOpacity>
    </Card>
  )
};

export default function VendingScreen() {
    const state = useSelector(state => state)
    const [data, setData] = React.useState({ isLoading: true, machines: [] })
    const map = React.useRef(null)
    const flatlist = React.useRef(null)
  
    React.useEffect(() => {
      let isMounted = true;
      state.userToken && fetch(api.machines, {headers: { token: state.userToken }})
        .then(response => {
          if (response.ok)
            return response.json()
          else
            throw new Error('Network response was not ok');
        })
        .then(json => isMounted && setData({isLoading: false, machines: json}))
        .catch(error => {
          console.log("no correct response");
          setData({ isLoading: true, machines: [] })
          actions.signOut()
        })
      return () => { isMounted = false };
    });

    state.location && data.machines && data.machines.sort((a,b) => 
    (getDistance(state.location.coords, {latitude: a.Latitude, longitude: a.Longitude}) 
      - getDistance(state.location.coords, {latitude: b.Latitude, longitude: b.Longitude})))

    const renderItem = ({ item, index }) => (
      <Item item={item} onPress={()=>{
        console.log(item.Name)
        map.current.animateCamera({center: {latitude: item.Latitude, longitude: item.Longitude }, zoom: 15 }, 5000 )
      }}/>
    );
  
    return (
      data.isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MapView style={{flex: 2}}
            ref={map}
            initialRegion={state.location ?
              {
              ...state.location.coords,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : undefined}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {data.machines.map((marker, index) => (
              <MapView.Marker
                key={marker.GUID}
                coordinate={{latitude: marker.Latitude || state.location.coords.latitude, longitude: marker.Longitude || state.location.coords.longitude}}
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