// @flow
import _ from 'lodash';
import {Platform} from 'react-native';
import {dispatch, getState} from './store';
import axios, {AxiosResponse} from 'axios';
import DeviceInfo from 'react-native-device-info';
import {defObject, getMessage, optimizedCall} from '../utils';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {_REQUEST, _SUCCESS, _FAILURE, API_URL, WAIT_TIMEOUT, API_AUTH} from '../constants';
import Application from '../modules/application';

let refreshing: boolean = false;
const emitter = new EventEmitter(null);
const endRefreshTokenEventName = 'end-refresh-token';

export function setAuthHeaderByAction(token: ?string, key: string = 'Token', useBearer: boolean = false) {
    axios.defaults.headers.common = {
        ...axios.defaults.headers.common,
        [key]: null,
    };
    if (token) {
        axios.defaults.headers.common[key] = useBearer ? 'Bearer ' + token : token;
    }
    return token;
}

const hasToken = (): boolean => (getState().auth.token || '').length > 4;

const waitRefreshing = () =>
    new Promise<void>((resolve) => {
        if (refreshing) {
            let waitTimerId = null,
                onEndRefreshToken = () => {
                    waitTimerId !== null && clearTimeout(waitTimerId);
                    emitter.removeListener(endRefreshTokenEventName, onEndRefreshToken);
                    optimizedCall(resolve);
                };

            waitTimerId = setTimeout(() => onEndRefreshToken(), WAIT_TIMEOUT); // Timeout <- 20 sec.
            emitter.addListener(endRefreshTokenEventName, onEndRefreshToken);
            return;
        }
        resolve();
    });

const refreshToken = () =>
    refreshing
        ? waitRefreshing()
        : new Promise<string>((resolve, reject) => {
              refreshing = true;
              const pushToken = Application.getActiveDevicePushToken();
              dispatch({type: _REQUEST(API_AUTH)});
              axios
                  .post(`${API_URL}/Authenticate`, {
                      ...(pushToken ? {PushNotificationToken: pushToken} : {}),
                      GUID: DeviceInfo.getUniqueId(),
                      OSType: Platform.select({ios: 1, android: 2, default: -1}),
                      BuildApp: DeviceInfo.getReadableVersion(),
                      OSVersion: DeviceInfo.getSystemVersion(),
                      BundleID: DeviceInfo.getBundleId(),
                  })
                  .then((response: AxiosResponse) => {
                      const obj = defObject(response.data);
                      if (!obj) {
                          return Promise.reject(new Error('Invalid response data object!'));
                      }
                      if ('token' in response.headers && response.headers.token) {
                          const partitions = obj.modules || [];
                          console.log('TOKEN', response.headers.token);
                          dispatch({
                              partitions,
                              type: _SUCCESS(API_AUTH),
                              payload: _.omit(obj, ['modules']),
                              token: setAuthHeaderByAction(response.headers.token),
                          });
                          return resolve(response.headers.token);
                      }
                      return Promise.reject(new Error('Response Token not found!'));
                  })
                  .catch((error) => {
                      dispatch({type: _FAILURE(API_AUTH), message: getMessage(error)});
                      reject(error);
                  })
                  .then(() => {
                      refreshing = false;
                      emitter.emit(endRefreshTokenEventName);
                  });
          });

const getSettings = () => {
    return new Promise((resolve, reject) => {
        console.log('TOKEN::::', getState().auth.token);
        setAuthHeaderByAction(getState().auth.token);
        axios
            .get(`${API_URL}/settings`, {})
            .then((response: AxiosResponse) => {
                const obj = defObject(response.data);
                if (!obj) {
                    return Promise.reject(new Error('Invalid response data object!'));
                }

                const partitions = obj.modules || [];
                console.log('GET SETTINGS', obj);
                dispatch({
                    partitions,
                    type: _SUCCESS(API_AUTH),
                    payload: _.omit(obj, ['modules']),
                    token: getState().auth.token,
                });
                return resolve();
            })
            .catch((error) => {
                dispatch({type: _FAILURE(API_AUTH), message: getMessage(error)});
                reject(error);
            });
    });
};

export default {
    emitter,
    hasToken,
    refreshToken,
    waitRefreshing,
    getSettings,
    endRefreshTokenEventName,
};
