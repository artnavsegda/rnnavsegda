import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { Button, ActivityIndicator, DataTable, List, Chip, Text } from 'react-native-paper'
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
        console.log("Found: " + device.name + "id: " +  device.id + " uuids: " + JSON.stringify(device.serviceUUIDs))
        setMyMap(new Map(myMap.set(device.id, {name: device.name, lastSeen: Date.now(), uuids: device.serviceUUIDs})))
      });
  
      setTimeout(()=>{
        scan_stop()
      },60000)
    }
  
    return (
      <View style={{flex:1}}>
        <View style={{flexDirection: "row"}}>
        <Button onPress={scan_start}>Start scan</Button>
        <Button onPress={scan_stop}>Stop scan</Button>
        <ActivityIndicator animating={scanning} />
        </View>
        <ScrollView>
        {[...myMap.keys()].map(k => {
          let d = new Date(myMap.get(k).lastSeen);
          return (
            <List.Accordion key={k}
              title={myMap.get(k).name || "🤷🏼‍♀️"}
              description={k}
              left={props => <Chip mode="outlined">{d.toLocaleTimeString()}</Chip>}
            >
              {myMap.get(k).uuids && myMap.get(k).uuids.map(uuid => 
                <List.Subheader key={uuid}>{uuid}</List.Subheader>
              )}
            </List.Accordion>
            )
        })}
        </ScrollView>
      </View>
    );
  }