import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { Button, DataTable, Paragraph } from 'react-native-paper';

const products = [{"ID":40,"Name":"Цехобон с карамелью","PictureID":20316,"PictureTime":"2020-06-01T21:00:25.623"},{"ID":41,"Name":"Цехобон с корицей","PictureID":20320,"PictureTime":"2020-06-01T21:06:51.953"},{"ID":42,"Name":"Цехобон с шоколадом и малиной","PictureID":20324,"PictureTime":"2020-06-01T21:25:48.923"},{"ID":32,"Name":"Краст из овсянки с клюквой","PictureID":10131,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":22,"Name":"Брауни карамельный","PictureID":10127,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":31,"Name":"Брауни классический","PictureID":20722,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":35,"Name":"Маффин шоколадный","PictureID":20256,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":37,"Name":"Ром-баба","PictureID":20288,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":39,"Name":"Сочень с творогом","PictureID":10139,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":10244,"Name":"Сырный шарик","PictureID":20889,"PictureTime":"2019-02-02T09:56:28.077"},{"ID":71,"Name":"Сметанник с черной смородиной","PictureID":20276,"PictureTime":"2018-11-12T16:42:44.637"},{"ID":63,"Name":"Медовик классический","PictureID":20424,"PictureTime":"2018-11-12T16:42:44.637"}]

const Spinner = (props) => (
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Button onPress={props.onMinus}>-</Button><Text>{props.value}</Text><Button onPress={props.onPlus}>+</Button>
      </View>
)

const App = () => {
  const [state, setState] = React.useState(products);


  const renderItem = ({ item, index }) => (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <Image style={{width: 60, height: 60, margin: 10, borderRadius: 10}} source={{uri: 'https://app.tseh85.com/DemoService/api/image?PictureId='+item.PictureID}}/>
      <Paragraph style={{ flex: 4, textAlignVertical: 'center' }}>{item.Name}</Paragraph>
      <Spinner value={item.value ? item.value : 0} onPlus={()=>{
        let newState = [...state];
        if (!newState[index].value)
          newState[index].value = 0;
        newState[index].value++        
        setState(newState);
      }}
      onMinus={()=>{
        let newState = [...state];
        if (!newState[index].value)
          newState[index].value = 0;
        if (newState[index].value > 0)
          newState[index].value--        
        setState(newState);
      }}
      
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state}
        renderItem={renderItem}
        keyExtractor={item => item.ID}
      />
      <Button onPress={()=>{
        console.log(JSON.stringify(
          state.map((element)=>{
            return { ProductID: element.ID, Quantity: element.value ? element.value : 0 }
          })
        ))
      }}>Send</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default App;