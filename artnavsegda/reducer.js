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
        newstate[action.id].light = !newstate[action.id].light;
        return newstate;
      break;
      case 'SET':
        newstate[action.id].light = action.payload;
        return newstate;
      break;
      case 'DIM':
        newstate[action.id].intensity = action.level;
        return newstate;
      break;
      case 'HUE':
        newstate[action.id].hue = action.color;
        return newstate;
      break;
      default:
        return state;
    }
  }

  export default reducer;