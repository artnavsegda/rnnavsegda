import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    login: {
      width: 150,
      height: 40,
      margin: 5,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      width: Dimensions.get('window').width - 32
    }
});
