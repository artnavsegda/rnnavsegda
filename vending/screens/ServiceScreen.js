import * as React from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, Image, Alert } from 'react-native';
import { Text, Button, Paragraph, ActivityIndicator, IconButton, Caption } from 'react-native-paper';
import store from '../store';

const Spinner = (props) => (
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
    <IconButton icon="minus" onPress={props.onMinus}/><Text>{props.value}</Text><IconButton icon="plus" onPress={props.onPlus}/>
  </View>
)

const Productlist = (props) => {
  const [state, setState] = React.useState(props.data.map(element => {return {ProductID: element.ID, Quantity: 0}}));

  const renderItem = ({ item, index }) => (
  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
    <Image style={{width: 60, height: 60, margin: 10, borderRadius: 10}} source={{uri: 'https://app.tseh85.com/DemoService/api/image?PictureId='+item.PictureID}}/>
    <Paragraph style={{ flex: 4, alignSelf: 'center' }}>{item.Name}</Paragraph>
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
    <Button style={{padding: 10}} icon="page-next-outline" onPress={()=>{
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

  React.useEffect(()=>{
    switch(stage)
    {
      case 0:
        navigation.setOptions({ title: 'Инвентаризация' })
        break;
      case 1:
        navigation.setOptions({ title: 'Изъятие' })
        break;
      case 2:
        navigation.setOptions({ title: 'Пополнение' })
        break;
      case 3:
        navigation.setOptions({ title: 'Обслуживание' })
        break;
    }
  })

  if (products.loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
      </View>
    )

  switch(stage)
  {
    case 0:
      return (
        <View style={{flex: 1}}>
          <Productlist data={products.list} onSend={(result)=>{
            setProducts({...products, loading: true})
            let req = JSON.stringify({MachineGUID: state.servicingMachineID, Type: 0, Rows: result });
            console.log(req);
            fetch(api.service, {method: 'POST', headers: { token: state.userToken, 'Content-Type': 'text/json' }, body: req})
            .then(response => response.json())
            .then(status => {
              if (status.Result)
                Alert.alert("Ошибка", status.ErrorMessage)
              else
              {
                setProducts({...products, loading: false})
                setStage(1)
              }
            })
            .catch((error) => {
              console.log(error)
            })
          }} />
        </View>
      )
    case 1:
      return (
        <View style={{flex: 1}}>
          <Productlist data={products.list} onSend={(result)=>{
            setProducts({...products, loading: true})
            let req = JSON.stringify({MachineGUID: state.servicingMachineID, Type: 1, Rows: result });
            console.log(req);
            fetch(api.service, {method: 'POST', headers: { token: state.userToken, 'Content-Type': 'text/json' }, body: req})
            .then(response => response.json())
            .then(status => {
              if (status.Result)
                Alert.alert("Ошибка", status.ErrorMessage)
              else
              {
                setProducts({...products, loading: false})
                setStage(2)
              }
            })
            .catch((error) => {
              console.error('Error:', error)
            })
          }} />
        </View>
      )
    case 2:
      return (
        <View style={{flex: 1}}>
          <Productlist data={products.list} onSend={(result)=>{
            setProducts({...products, loading: true})
            let req = JSON.stringify({MachineGUID: state.servicingMachineID, Type: 2, Rows: result });
            console.log(req);
            fetch(api.service, {method: 'POST', headers: { token: state.userToken, 'Content-Type': 'text/json' }, body: req})
            .then(response => response.json())
            .then(status => {
              if (status.Result)
                Alert.alert("Ошибка", status.ErrorMessage)
              else
              {
                setProducts({...products, loading: false})
                setStage(3)
              }
            })
            .catch((error) => {
              console.error('Error:', error)
            })
          }} />
        </View>
      )
    case 3:
      return (
        <View style={styles.container}>
          <Image source={require('../resources/img-vending.png')} />
          <Caption style={{ fontSize: 15, padding: 20 }}>Закройте дверь!</Caption>
        </View>
      )
  }
}