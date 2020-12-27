import * as React from 'react'
import { useSelector } from 'react-redux'
import {  Appbar, Menu } from 'react-native-paper'

import actions from '../actions'

export default function CustomNavigationBar({ scene, navigation, previous }) {
    const state = useSelector(state => state)
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
        {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={title} />
        { state.userToken && !previous ? <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item icon={state.debug ? "checkbox-marked-outline" : "checkbox-blank-outline" } onPress={actions.debugToggle} title="Debug" />
          {state.debug ? <Menu.Item onPress={() => navigation.navigate('BLE Scanner')} icon="radar" title="BLE Scanner" /> : null}
          <Menu.Item icon="logout" onPress={actions.signOut} title="Выход" />
        </Menu> : null }
      </Appbar.Header>
    )
  }