import * as React from 'react';
import { useSelector } from 'react-redux';
import { View, Alert, Image, FlatList } from 'react-native';
import { Button, Portal, Modal, Paragraph, Text, Title, Headline, Subheading, List } from 'react-native-paper';

export default function StorageScreen() {
    const token = useSelector(state => state.userToken)
    const [state, setState] = React.useState({modalOpen: false, content:[], type: null});
    const hideModal = () => setVisible(false);
    function receipt() {
      fetch(api.invoice + '?' + new URLSearchParams({ Type: 0 }), {headers: { token }})
      .then(response => response.json())
      .then(invoice => {
        console.log(JSON.stringify(invoice));
        if (invoice.length < 1)
        {
          console.log("receipt empty")
          Alert.alert('Получение', "Список пуст.")
        }
        else
        {
          setState({
            modalOpen: true,
            content:invoice,
            type: 0
          })
        }
      })
    }
    function writeoff() {
      fetch(api.invoice + '?' + new URLSearchParams({ Type: 1 }), {headers: { token }})
      .then(response => response.json())
      .then(invoice => {
        console.log(JSON.stringify(invoice))
        if (invoice.length < 1)
        {
          console.log("writeoff empty")
          Alert.alert('Сдача', "Список пуст.")
        }
        else
          setState({
            modalOpen: true,
            content:invoice,
            type: 1
          })
      })
    }
  
    function invoiceconfirm() {
      fetch(api.invoiceconfirm, {method: 'POST', headers: { token, 'Content-Type': 'text/json' }, body: JSON.stringify({ Type: state.type })})
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setState({modalOpen: false, content:[], type: null})
      })
      .catch((error) => {
        console.error('Error:', error)
      });
    }
  
    const renderItem = ({ item, index }) => (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Image style={{width: 60, height: 60, margin: 10, borderRadius: 10}} source={{uri: 'https://app.tseh85.com/DemoService/api/image?PictureId='+item.PictureID}}/>
        <Paragraph style={{ flex: 4, textAlignVertical: 'center' }}>{item.Name}</Paragraph>
        <Paragraph style={{textAlignVertical: 'center', margin: 20 }}>{item.Quantity}</Paragraph>
      </View>
    );

    return (
      <View>
        <Portal>
          <Modal visible={state.modalOpen} dismissable={false} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', padding: 5, margin: 10, marginTop: 40 ,flex: 1}}>
            <FlatList
              data={state.content}
              keyExtractor={item => item.ID}
              renderItem={renderItem}
            />
            <View style={{justifyContent: 'space-around', flexDirection: 'row', padding: 5}}>
              <Button onPress={()=>setState({modalOpen: false, content:[], type: null})}>Закрыть</Button>
              <Button onPress={invoiceconfirm}>{state.type ? "Сдать" : "Принять"}</Button>
            </View>
          </Modal>
        </Portal>
        <List.Section>
          <List.Item
            title="Получение"
            description="Получение товара по накладной"
            left={props => <List.Icon {...props} icon="cart-arrow-down" />}
            onPress={receipt}
          />
          <List.Item
            title="Сдача"
            description="Сдача старого товара на склад"
            left={props => <List.Icon {...props} icon="cart-arrow-up" />}
            onPress={writeoff}
          />
          <List.Item
            title="Сумка"
            description="Cписок товаров по аппаратам для загрузки"
            left={props => <List.Icon {...props} icon="bag-personal-outline" />}
            onPress={()=>{console.log("click3")}}
          />
        </List.Section>
      </View>
    );
  }