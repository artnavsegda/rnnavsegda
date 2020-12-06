import * as React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, FlatList, Image } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import store from '../store';

const Spinner = (props) => (
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
    <Button onPress={props.onMinus}>-</Button><Text>{props.value}</Text><Button onPress={props.onPlus}>+</Button>
  </View>
)

const Productlist = (props) => {
  const [state, setState] = React.useState(props.data.map(element => {return {ProductID: element.ID, Quantity: 0}}));

  const renderItem = ({ item, index }) => (
  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
    <Image style={{width: 60, height: 60, margin: 10, borderRadius: 10}} source={{uri: 'https://app.tseh85.com/DemoService/api/image?PictureId='+item.PictureID}}/>
    <Paragraph style={{ flex: 4, textAlignVertical: 'center' }}>{item.Name}</Paragraph>
    <Spinner value={state[index].Quantity} onPlus={()=>{
      let newState = [...state]
      newState[index].Quantity++
      setState(newState)
    }} onMinus={()=>{
      if (state[index].Quantity > 0)
      {
        let newState = [...state]
        newState[index].Quantity--
        setState(newState)
      }
    }}/>
  </View>
  );

  return (
  <View style={{flex: 1}}>
    <FlatList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={item => item.ID}
    />
    <Button onPress={()=>{
      props.onSend(state)
      setState(props.data.map(element => {return {ProductID: element.ID, Quantity: 0}}))
    }}>Далее</Button>
  </View>
  );
}

export default function ServiceScreen({navigation}) {
  const state = useSelector(state => state)
  const [products, setProducts] = React.useState({loading: true})
  const [stage, setStage] = React.useState(0)

  React.useEffect(() => {
    fetch(api.products + '?' + new URLSearchParams({ MachineGUID: state.servicingMachineID }), {headers: { token: state.userToken }})
    .then(response => response.json())
    .then(products => {
      setProducts({loading: false, list: products})
    })

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
  }, [])

  if (products.loading)
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )

  switch(stage)
  {
    case 0:
      navigation.setOptions({ title: 'Инвентаризация' })
      return (
        <View style={{flex: 1}}>
          <Productlist data={products.list} onSend={(result)=>{
            console.log(result);
            setStage(1);
          }} />
        </View>
      )
    case 1:
      case 0:
        navigation.setOptions({ title: 'Изъятие' })
        return (
          <View style={{flex: 1}}>
            <Productlist data={products.list} onSend={(result)=>{
              console.log(result);
              setStage(2);
            }} />
          </View>
        )
    case 2:
      case 0:
        navigation.setOptions({ title: 'Пополнение' })
        return (
          <View style={{flex: 1}}>
            <Productlist data={products.list} onSend={(result)=>{
              console.log(result);
              setStage(3);
            }} />
          </View>
        )
    case 3:
      case 0:
        navigation.setOptions({ title: 'Обслуживание' })
        return (
          <View style={styles.container}>
            <Text>Закройте дверь !</Text>
          </View>
        )
  }
}