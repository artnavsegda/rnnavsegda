const fetchPodcasts = (authKey) => {
    return { type: 'FETCHED_PODCASTS', key: authKey }
};

const fetchEpisodes = (podcastID) => {
    return { type: 'FETCHED_EPISODES', id: podcastID }
};

const requestPodcasts = () => {
    return { type: 'REQUESTED_PODCASTS' }
};

const requestPodcastsSuccess = (data) => {
    return { type: 'REQUESTED_PODCASTS_SUCCEEDED', podcasts: data }
};

const requestPodcastsError = () => {
    return { type: 'REQUESTED_PODCASTS_FAILED' }
};

const requestEpisodes = () => {
    return { type: 'REQUESTED_EPISODES' }
};

const requestEpisodesSuccess = (data) => {
    return { type: 'REQUESTED_EPISODES_SUCCEEDED', episodes: data }
};

const requestEpisodesError = () => {
    return { type: 'REQUESTED_EPISODES_FAILED' }
};

export { fetchPodcasts, requestPodcasts, requestPodcastsSuccess, requestPodcastsError, fetchEpisodes, requestEpisodes, requestEpisodesSuccess, requestEpisodesError };