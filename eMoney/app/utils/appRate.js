// @flow
import Rate, {AndroidMarket} from 'react-native-rate';

import AppRateConfig from '../../app.rate.config';

export function appRate(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        Rate.rate(
            {
                ...(AppRateConfig || {}),
                preferredAndroidMarket: AndroidMarket.Google,
                openAppStoreIfInAppFails: true,
                preferInApp: true,
            },
            (success: boolean) => {
                if (success) {
                    return resolve();
                }
                reject();
            },
        );
    });
}
