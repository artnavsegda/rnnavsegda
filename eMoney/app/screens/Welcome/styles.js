// @flow
import {Platform} from 'react-native';
import type {Theme} from '../../themes';
import AdvertisingGroup from '../../components/AdvertisingGroup';
import {STATUS_BAR_HEIGHT, BOTTOM_SPACE, TAB_BAR_HEIGHT} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme, {isModal, isParentTabs}: any) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        contentInset: {
            top: Platform.select({android: 0, ios: 10 + STATUS_BAR_HEIGHT}),
        },
        contentContainer: {
            paddingTop: Platform.select({ios: 0, android: 10 + STATUS_BAR_HEIGHT}),
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
        },
        progressViewOffset: 10 + STATUS_BAR_HEIGHT,
        content: {
            paddingBottom: 10,
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        loginButton: {
            backgroundColor: '#fff',
        },
        advertisingGroup: {
            paddingHorizontal: 20 - AdvertisingGroup.separatorSize,
        },
        indicatorColor: theme.colors.button,
    };
}
