import * as React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

let products = [];

export default function ServiceScreen() {
    const state = useSelector(state => state)
    const [serviceState, setServiceState] = React.useState({stage: 0});
    const [products, setProducts] = React.useState([]);
  
    React.useEffect(() => {
        fetch(api.products + '?' + new URLSearchParams({ MachineGUID: state.servicingMachineID }), {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(products => setProducts(products))

      let timerID = setInterval(()=>{
        console.log("service " + state.servicingMachineID + " heartbeat");
        fetch(api.status + '?' + new URLSearchParams({ MachineGUID: state.servicingMachineID }), {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(status => {
          console.log("status: " + JSON.stringify(status))
          if (status.Door == 0)
          {
            clearInterval(timerID);
            store.dispatch({ type: 'MACHINE', machine: null })
          }
        })
      },5000)
    }, []);
  
    switch (serviceState.stage)
    {
      case 0:
        return (
          <View style={styles.container}>
            <Text>Инвентаризация</Text>
            <Text>{JSON.stringify(products)}</Text>
            <Button onPress={()=>{setServiceState({stage: 1})}}>Дальше</Button>
          </View>
        );
      case 1:
        return (
          <View style={styles.container}>
            <Text>Изъятие</Text>
            <Button onPress={()=>{setServiceState({stage: 2})}}>Дальше</Button>
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <Text>Пополнение</Text>
            <Button onPress={()=>{setServiceState({stage: 3})}}>Дальше</Button>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <Text>Закройте дверь !</Text>
          </View>
        );
    }
  }
  