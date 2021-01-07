import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { Button, ActivityIndicator, DataTable } from 'react-native-paper'
import manager from '../ble'

export default function BLEScanner() {
    const [myMap, setMyMap] = React.useState(new Map())
    const [scanning, setScanning] = React.useState(false)
  
    function scan_stop()
    {
      setScanning(false)
      manager.stopDeviceScan()
    }
  
    function scan_start()
    {
      scan_stop();
      setScanning(true);
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error)
          return
        }
        console.log("Found: " + device.name + "id: " +  device.id)
        setMyMap(new Map(myMap.set(device.id, {name: device.name, lastSeen: Date.now()})))
      });
  
      setTimeout(()=>{
        scan_stop()
      },60000)
    }
  
    return (
      <View>
        <View style={{flexDirection: "row"}}>
        <Button onPress={scan_start}>Start scan</Button>
        <Button onPress={scan_stop}>Stop scan</Button>
        <ActivityIndicator animating={scanning} />
        </View>
        <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{flex: 4}}>Address</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
        </DataTable.Header>
        <ScrollView>
        {[...myMap.keys()].map(k => {
          let d = new Date(myMap.get(k).lastSeen);
          return (
            <DataTable.Row key={k}>
              <DataTable.Cell style={{flex: 4}}>{k}</DataTable.Cell>
              <DataTable.Cell>{myMap.get(k).name}</DataTable.Cell>
              <DataTable.Cell>{d.getHours()}:{d.getMinutes()}:{d.getSeconds()}</DataTable.Cell>
            </DataTable.Row>
            )
        })}
        </ScrollView>
        </DataTable>
      </View>
    );
  }