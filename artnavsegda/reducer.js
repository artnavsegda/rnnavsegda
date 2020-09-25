const initialState = {
  "Store.Ceiling":{
    light: false,
  },
  "Store.Phytolamp":{
    light: false
  },
  "Store.Spotlights":{
    light: false,
    intensity: 0
  },
  "Store.Ledstrip":{
    light: false,
    intensity: 0,
    hue: 0
  },
  "Meeting.Ceiling":{
    light: false,
  },
  "Meeting.Phytolamp":{
    light: false
  },
  "Meeting.Stagelights":{
    light: false
  },
  "Meeting.Recess":{
    light: false
  },
  "Meeting.Spotlights":{
    light: false,
    intensity: 0
  },
  "Meeting.Spotlights.2":{
    light: false,
    intensity: 0
  },
  "Meeting.Table":{
    light: false,
    intensity: 0
  },
  "Meeting.Ledstrip":{
    light: false,
    intensity: 0,
    hue: 0
  },
  "Store.Shade.Left":{
    light: false,
  },
  "Store.Shade.Right":{
    light: false
  },
  "Meeting.Blind":{
    light: false
  },
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