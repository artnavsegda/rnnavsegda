import * as React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Alert } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';

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
          Alert.alert('Получение', "Список пуст.");
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
        console.log(JSON.stringify(invoice));
        if (invoice.length < 1)
        {
          console.log("writeoff empty")
          Alert.alert('Сдача', "Список пуст.");
        }
        else
          setState({
            modalOpen: true,
            content:invoice,
            type: 0
          })
      })
    }
  
    function invoiceconfirm() {
      setState({modalOpen: false, content:[], type: null});
    }
  
    return (
      <View style={styles.container}>
        <Portal>
          <Modal visible={state.modalOpen} dismissable={false} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, marginTop: 40 ,flex: 1}}>
            <Text>{JSON.stringify(state.content)}</Text>
            <Button onPress={invoiceconfirm}>{state.type ? "Принять" : "Сдать"}</Button>
          </Modal>
        </Portal>
        <Button onPress={receipt}>Получение</Button>
        <Button onPress={writeoff}>Сдача</Button>
      </View>
    );
  }