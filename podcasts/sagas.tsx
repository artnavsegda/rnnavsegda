import { call, put, takeEvery } from 'redux-saga/effects'

import {requestPodcasts, requestPodcastsSuccess, requestPodcastsError, requestEpisodes, requestEpisodesSuccess, requestEpisodesError} from './actions'

function* fetchPodcastsAsync(action) {
    try {
        yield put(requestPodcasts());
        const data = yield call(() => {
            return fetch('https://api.simplecast.com/podcasts/', {headers: new Headers({'Authorization':'Bearer ' + action.key})})
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

function* fetchEpisodesAsync(action) {
    try {
        yield put(requestEpisodes());
        const data = yield call(() => {
            return fetch('https://api.simplecast.com/podcasts/' + action.id + '/episodes')
                    .then(res => res.json())
            }
        )
        yield put(requestEpisodesSuccess(data));
    } catch (error) {
        yield put(requestEpisodesError())
    }
}

function* watchFetchEpisodes() {
    yield takeEvery('FETCHED_EPISODES', fetchEpisodesAsync)
}

export { watchFetchPodcasts, watchFetchEpisodes };