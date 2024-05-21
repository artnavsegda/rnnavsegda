import 'proxy-polyfill';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { Platform, InteractionManager } from 'react-native';
import * as R from 'ramda';
import doing from '../doing';

let activeDeviceToken: ?string = null;

export function registerPushNotificationsToken(withReject: boolean = false): Promise<?string> {
    return new Promise(async (resolve, reject) => {
        try {
            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus) {
                console.log('Permission status:', authorizationStatus);
                if (authorizationStatus == messaging.AuthorizationStatus.DENIED) {
                    withReject ? reject(e) : resolve();
                    return;
                }
            }
            //await messaging().registerDeviceForRemoteMessages(); // auto registration 
            activeDeviceToken = await messaging().getToken();
            console.log('Registered device token: ', activeDeviceToken);

            setTimeout(() => resolve(activeDeviceToken), 1);
        } catch (e) {
            //console.warn('registerPushToken', getMessage(e));
            withReject ? reject(e) : resolve();
        }
    });
}

export function initPushNotifications() {
    if (Platform.OS === 'ios') {
        notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));
    }
    messaging().onMessage((notification) => {
        console.log('Notification Received - Foreground', notification);
        notifee.displayNotification({
            data: notification.data,
            title: notification.notification.title,
            body: notification.notification.body,
            android: {
                channelId: 'high_importance_channel',
            },
        });
    })

    notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
            case EventType.PRESS:
                //console.log('User pressed notification', detail.notification);
                handleNotificationPayload(detail.notification.data);
                break;
        }
    })

    messaging().onNotificationOpenedApp((notification) => {
        console.log('Notification Received - Background', notification.data);
        handleNotificationPayload(notification.data);
    })

    InteractionManager.runAfterInteractions(() => {
        messaging().getInitialNotification().then((notification) => {
            if (!notification) {
                return;
            }
            console.log('Notification Received - Startup', notification.data);
            handleNotificationPayload(notification.data);
        })
    });
}

export function handleNotificationPayload(payload: any) {
    console.log('NOTIFY PAYLOAD', payload);
    const messageType = R.pathOr(-1, ['messageType'], payload);
    if (messageType !== -1) {
        switch (messageType) {
            case 0:
                console.log('MESSAGE TYPE', messageType);
                doing.app.notifications.addNotification({
                    id: payload.identifier,
                    type: R.pathOr(-1, ['messageType'], payload),
                    messageData: R.pathOr({}, ['messageData'], payload),
                });
                //doing.app.notifications.addNotification({id: 12, messageData: {text: 'test'}});
                break;
            default:
        }
    }
    return true;
}

export function getActiveDevicePushToken(): ?string {
    return activeDeviceToken;
}
