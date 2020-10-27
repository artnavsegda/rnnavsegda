const initialState = {
  podcasts: '',
  episodes: '',
  loading: false,
  error: false,
  episodesLoading: false,
};

const reducer = (state = initialState, action) => {

  let newstate = {...state};

  switch (action.type) {
    case 'REQUESTED_PODCASTS':
      newstate.loading = true;
    break
    case 'REQUESTED_PODCASTS_SUCCEEDED':
      newstate.loading = false;
      newstate.podcasts = action.podcasts;
    break
    case 'REQUESTED_PODCASTS_FAILED':
      newstate.error = true;
    break
    case 'REQUESTED_EPISODES':
      newstate.episodesLoading = true;
    break;
    case 'REQUESTED_EPISODES_SUCCEEDED':
      newstate.episodesLoading = false;
      newstate.episodes = action.episodes;
    break;
    case 'REQUESTED_EPISODES_FAILED':
      newstate.error = true;
    break;
    default:
      return state
  }
  return newstate;
}

export default reducer;