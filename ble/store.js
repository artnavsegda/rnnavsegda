import { createStore } from 'redux'

let store = createStore((prevState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userName: "",
    location: null,
    beacons: []
  }, action) => {
    switch (action.type) {
      case 'MACHINE':
        return {
          ...prevState,
          servicingMachineID: action.machine,
        };
      case 'BEACONS':
        return {
          ...prevState,
          beacons: action.beacons,
        };
      case 'LOCATION':
        return {
          ...prevState,
          location: action.location,
        };
      case 'USER_NAME':
        return {
          ...prevState,
          userName: action.username,
        };
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userName: action.username,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
      default:
        return prevState;
    }
  })
  
  export default store;