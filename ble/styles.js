import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    login: {
      width: 150,
      height: 40,
//      borderColor: 'gray',
//      borderWidth: 1,
      backgroundColor: '#fff',
      margin: 5,
//      padding: 5
    },
    item: {
//      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      width: Dimensions.get('window').width - 32
    }
});
