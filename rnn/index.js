// In index.js of a new project
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';

// Home screen declaration
const HomeScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Hello React Native Navigation 👋</Text>
      <Button
        title='Open modal' 
        onPress={() => Navigation.showModal({
          stack: {
            children: [
              {
                component: {
                  name: 'Modal',
                  options: {
                    modalPresentationStyle: 'fullScreen',
                    topBar: {
                      title: {
                        text: 'Modal',
                      },
                    },
                  },
                },
              },
            ],
          },
        })}/>
      <Button
        title='Push Settings Screen'
        color='#710ce3'
        onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Settings',
            options: {
              topBar: {
                title: {
                  text: 'Settings'
                }
              }
            }
          }
        })}/>
    </View>
  );
};
HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home',
    }
  }
};

// Settings screen declaration - this is the screen we'll be pushing into the stack
const SettingsScreen = () => {
  return (
    <View style={styles.root}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const ModalScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Modal Screen</Text>
      <Button title="Dismiss" onPress={()=>{
        Navigation.dismissModal(props.componentId);
      }}/>
    </View>
  );
}

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);
Navigation.registerComponent('Modal', () => ModalScreen);

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a'
  },
  topBar: {
    title: {
      color: 'white'
    },
    backButton: {
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
});
Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Home'
            }
          }
        ]
      }
    }
  });
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke'
  }
});