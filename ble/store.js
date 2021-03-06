import { createStore } from 'redux'

let store = createStore((prevState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userName: "",
    location: null,
    servicingMachineID: null,
    debug: false
  }, action) => {
    switch (action.type) {
      case 'MACHINE':
        return {
          ...prevState,
          servicingMachineID: action.machine,
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
      case 'DEBUG_TOGGLE':
        return {
          ...prevState,
          debug: !prevState.debug
        };
      default:
        return prevState;
    }
  })
  
  export default store;