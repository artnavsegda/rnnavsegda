import React, { useState, useEffect } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import NativeIntentAndroid from 'react-native/Libraries/Linking/NativeIntentAndroid'
import DeepLinking from "react-native-deep-linking";

const NativeLinking = Platform.OS === 'android' ? NativeIntentAndroid : Linking

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await NativeLinking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
    Linking.addEventListener('url', (event) => {
      setUrl(event.url);
    });
  });

  return { url, processing };
};

const App = () => {
  const { url: initialUrl, processing } = useInitialURL();
  NativeIntentAndroid.getInitialURL().then(url => console.log(url))

  return (
    <View style={styles.container}>
      <Text>
        {processing
          ? `Processing the initial url from a deep link`
          : `The deep link is: ${initialUrl || "None"}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default App;