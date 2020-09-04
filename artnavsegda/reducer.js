const initialState = {
    1:{
      myLight: false
    },
    2:{
      myLight: false
    },
    3:{
      myLight: false
    },
    4:{
      myLight: false
    }
  };

const reducer = (state = initialState, action) => {
    if (typeof state === 'undefined') {
      return 0
    }
  
    let newstate = {...state};
  
    switch (action.type) {
      case 'TOGGLE':
        newstate[action.id].myLight = !newstate[action.id].myLight;
        return newstate;
      break;
      case 'ON':
        newstate[action.id].myLight = true;
        return newstate;
      break;
      case 'OFF':
        newstate[action.id].myLight = false;
        return newstate;
      break;
      default:
        return state;
    }
  }

  export default reducer;