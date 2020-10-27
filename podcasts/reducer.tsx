const initialState = {
    podcasts: '',
    loading: false,
    error: false,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REQUESTED_PODCASTS':
        return {
          podcasts: '',
          loading: true,
          error: false,
        };
      case 'REQUESTED_PODCASTS_SUCCEEDED':
        return {
          podcasts: action.podcasts,
          loading: false,
          error: false,
        };
      case 'REQUESTED_PODCASTS_FAILED':
        return {
          podcasts: '',
          loading: false,
          error: true,
        };
      default:
        return state
    }
  }
  
  export default reducer;