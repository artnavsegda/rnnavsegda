import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, useColorScheme} from 'react-native'
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Text, Appbar, Menu, Button, List
} from 'react-native-paper'
import { 
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
}
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
}

const Stack = createStackNavigator()

function CustomNavigationBar({ scene, navigation, previous }) {
  const { options } = scene.descriptor;
  const title = options.headerTitle !== undefined
    ? options.headerTitle
    : options.title !== undefined
    ? options.title
    : scene.route.name;

  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }>
        <Menu.Item icon="content-cut" onPress={() => {console.log('Option 1 was pressed')}} title="Option 1" />
        <Menu.Item icon="content-cut" onPress={() => {console.log('Option 2 was pressed')}} title="Option 2" />
        <Menu.Item icon="content-cut" onPress={() => {console.log('Option 3 was pressed')}} title="Option 3" disabled />
      </Menu>
    </Appbar.Header>
  )
}

function App() {
  return (
    <View>
      <List.Item
        title="Получение"
        description="Получение товара по накладной"
        left={props => <List.Icon {...props} icon="cart-arrow-down" />}
        onPress={()=>{console.log("click1")}}
      />
      <List.Item
        title="Сдача"
        description="Сдача старого товара на склад"
        left={props => <List.Icon {...props} icon="cart-arrow-up" />}
        onPress={()=>{console.log("click2")}}
      />
      <List.Item
        title="Сумка"
        description="Cписок товаров по аппаратам для загрузки"
        left={props => <List.Icon {...props} icon="bag-personal-outline" />}
        onPress={()=>{console.log("click3")}}
      />
      <StatusBar style="auto" />
    </View>
  )
}

export default function Main() {
  const scheme = useColorScheme()
  return (
    <PaperProvider>
      <NavigationContainer theme={scheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}>
        <Stack.Navigator screenOptions={{ header: (props) => <CustomNavigationBar {...props} /> }}>
          <Stack.Screen name="App" component={App} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
/*     backgroundColor: '#fff', */
    alignItems: 'center',
    justifyContent: 'center',
  },
})
