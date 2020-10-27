import { call, put, takeEvery } from 'redux-saga/effects'

let authHeader = new Headers({'Authorization':'Bearer eyJhcGlfa2V5IjoiNzVkMzc3N2M3NWFhM2QwOTkxOWEyZTI4ZjhiM2M1YTkifQ=='})

const requestPodcasts = () => {
    return { type: 'REQUESTED_PODCASTS' }
};

const requestPodcastsSuccess = (data) => {
    return { type: 'REQUESTED_PODCASTS_SUCCEEDED', podcasts: data }
};

const requestPodcastsError = () => {
    return { type: 'REQUESTED_PODCASTS_FAILED' }
};

function* fetchPodcastsAsync() {
    try {
        yield put(requestPodcasts());
        const data = yield call(() => {
            return fetch('https://api.simplecast.com/podcasts/', {headers: authHeader})
                    .then(res => res.json())
            }
        )
        yield put(requestPodcastsSuccess(data));
    } catch (error) {
        yield put(requestPodcastsError())
    }
}

function* watchFetchPodcasts() {
    yield takeEvery('FETCHED_PODCASTS', fetchPodcastsAsync)
}

export default watchFetchPodcasts;