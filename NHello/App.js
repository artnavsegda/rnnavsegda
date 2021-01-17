import React from 'react';
import { NativeModules, Button, View } from 'react-native';

// const { BeaconModule } = NativeModules;

const App = () => {
  const onPress = () => {
/*     console.log('We will invoke the native module here!');
    BeaconModule.doSomething(
      'testName',
      'testLocation',
      (eventId) => {
        console.log(`eventid is ${eventId}`);
      }
    );
    console.log("return: " + BeaconModule.getName()); */
  };

  return (
    <View>
      <Button
        title="Click to invoke your native module!"
        color="#841584"
        onPress={onPress}
      />
    </View>
  );
};

export default App;