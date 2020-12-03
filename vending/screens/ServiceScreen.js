import * as React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, FlatList, Image } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';

const Spinner = (props) => (
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
    <Button onPress={props.onMinus}>-</Button><Text>{props.value}</Text><Button onPress={props.onPlus}>+</Button>
  </View>
)

export default function ServiceScreen() {
    const state = useSelector(state => state)
    const [serviceState, setServiceState] = React.useState({stage: 0});
    const [products, setProducts] = React.useState({loading: true, list: []});
  
    React.useEffect(() => {
        fetch(api.products + '?' + new URLSearchParams({ MachineGUID: state.servicingMachineID }), {headers: { token: state.userToken }})
        .then(response => response.json())
        .then(products => setProducts({loading: false, list: products}))

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

    const renderItem = ({ item, index }) => (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Image style={{width: 60, height: 60, margin: 10, borderRadius: 10}} source={{uri: 'https://app.tseh85.com/DemoService/api/image?PictureId='+item.PictureID}}/>
        <Paragraph style={{ flex: 4, textAlignVertical: 'center' }}>{item.Name}</Paragraph>
        <Spinner value={item.value ? item.value : 0} />
      </View>
    );
  
    if (products.loading)
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      );

    switch (serviceState.stage)
    {
      case 0:
        return (
          <View style={{flex: 1}}>
            <Text>Инвентаризация</Text>
            {/* <Text>{JSON.stringify(products)}</Text> */}
            <FlatList
              data={products.list}
              renderItem={renderItem}
              keyExtractor={item => item.ID}
            />
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
  