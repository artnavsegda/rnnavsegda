import * as React from 'react';
import { Provider, useSelector } from 'react-redux'
import { Text, TextInput, View, Alert } from 'react-native';
import { Provider as PaperProvider, Button, Portal, Modal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';

import store from './store';
import actions from './actions';
import styles from './styles';

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import VendingScreen from './screens/VendingScreen';

function StorageScreen() {
  const token = useSelector(state => state.userToken)
  const [state, setState] = React.useState({modalOpen: false, content:[], type: null});
  const [visible, setVisible] = React.useState(false);
  const hideModal = () => setVisible(false);
  function receipt(){
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
        setVisible(true)
    })
  }
  function writeoff(){
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
        setVisible(true)
    })
  }

  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} dismissable={false} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, marginTop: 40 ,flex: 1}}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button onPress={receipt}>Получение</Button>
      <Button onPress={writeoff}>Сдача</Button>
    </View>
  );
}

function ServiceScreen() {
  const state = useSelector(state => state)
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
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

  switch (stage)
  {
    case 0:
      return (
        <View style={styles.container}>
          <Text>Инвентаризация</Text>
          <Button onPress={()=>{setStage(1)}}>Дальше</Button>
        </View>
      );
    case 1:
      return (
        <View style={styles.container}>
          <Text>Изъятие</Text>
          <Button onPress={()=>{setStage(2)}}>Дальше</Button>
        </View>
      );
    case 2:
      return (
        <View style={styles.container}>
          <Text>Пополнение</Text>
          <Button onPress={()=>{setStage(3)}}>Дальше</Button>
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

function ProfileScreen() {
    return (
      <View style={styles.container}>
        <Button onPress={actions.signOut}>Выход</Button>
      </View>
    );
  }

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Аппараты" component={VendingScreen} />
      <Tab.Screen name="Склад" component={StorageScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function App({ navigation }) {
  const state = useSelector(state => state)

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      store.dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : state.userToken == null ? (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Цех 85',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : state.servicingMachineID == null ? (
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: state.userName }}/>
        ) : (
          <Stack.Screen name="Service" component={ServiceScreen} options={{ title: "Обслуживание" }}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function ConnectedApp() {
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });

  Location.watchPositionAsync({}, (location) => {
    store.dispatch({ type: 'LOCATION', location: location });
    console.log(JSON.stringify(location));
  })

  return(
    <Provider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </Provider>
  )
}