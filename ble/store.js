import { createStore } from 'redux'

let store = createStore((prevState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userName: "",
    location: null
  }, action) => {
    switch (action.type) {
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