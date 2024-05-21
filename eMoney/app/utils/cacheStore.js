//@flow
import AsyncStorage from '@react-native-community/async-storage';

// Inspired by lscache https://github.com/pamelafox/lscache
const CACHE_PREFIX = '__cs-';
const CACHE_EXPIRATION_PREFIX = '__cs-exp-';
const EXPIRY_UNITS = 60 * 1000; // Time resolution in minutes

function currentTime() {
    return Math.floor(new Date().getTime() / EXPIRY_UNITS);
}

export const CacheStore = {
    get(key: string) {
        const theKey = CACHE_PREFIX + key;
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        return AsyncStorage.getItem(exprKey)
            .then(expiry => {
                if (expiry && currentTime() >= parseInt(expiry, 10)) {
                    AsyncStorage.multiRemove([exprKey, theKey]);
                    return Promise.reject(null);
                }
                return AsyncStorage.getItem(theKey)
                    .then(item => Promise.resolve(JSON.parse(item)))
                    .catch(() => Promise.reject(null));
            })
            .catch(() => Promise.reject(null));
    },

    set(key: string, value: string, time: number = 0) {
        const theKey = CACHE_PREFIX + key;
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        if (time) {
            return AsyncStorage.setItem(exprKey, (currentTime() + time).toString())
                .then(() => AsyncStorage.setItem(theKey, JSON.stringify(value)))
                .catch(() => Promise.reject(null));
        } else {
            AsyncStorage.removeItem(exprKey);
            return AsyncStorage.setItem(theKey, JSON.stringify(value));
        }
    },

    remove(key: string) {
        return AsyncStorage.multiRemove([CACHE_EXPIRATION_PREFIX + key, CACHE_PREFIX + key]);
    },

    isExpired(key: string) {
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        return AsyncStorage.getItem(exprKey)
            .then(expiry =>
                expiry && currentTime() >= parseInt(expiry, 10) ? Promise.resolve() : Promise.reject(null),
            )
            .catch(() => Promise.reject(null));
    },

    flush() {
        return AsyncStorage.getAllKeys()
            .then(keys =>
                AsyncStorage.multiRemove(
                    keys.filter(key => key.indexOf(CACHE_PREFIX) === 0 || key.indexOf(CACHE_EXPIRATION_PREFIX) === 0),
                ),
            )
            .catch(() => Promise.reject(null));
    },

    flushExpired() {
        return AsyncStorage.getAllKeys()
            .then(keys => {
                keys.forEach(key => {
                    if (key.indexOf(CACHE_EXPIRATION_PREFIX) === 0) {
                        const exprKey = key;
                        return AsyncStorage.getItem(exprKey)
                            .then(expiry => {
                                if (expiry && currentTime() >= parseInt(expiry, 10)) {
                                    const theKey = CACHE_PREFIX + key.replace(CACHE_EXPIRATION_PREFIX, '');
                                    return AsyncStorage.multiRemove([exprKey, theKey]);
                                }
                                return Promise.resolve();
                            })
                            .catch(() => Promise.reject(null));
                    }
                    return Promise.resolve();
                });
            })
            .catch(() => Promise.reject(null));
    },
};

// Always flush expired items on start time
CacheStore.flushExpired();
