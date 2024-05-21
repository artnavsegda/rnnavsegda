// @flow
import type {Theme} from '../../themes';
import {getContainerTopPadding, NAV_BAR_HEIGHT, BOTTOM_SPACE, TAB_BAR_HEIGHT} from '../../constants';
import AdvertisingGroup from '../../components/AdvertisingGroup';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme, {isModal, isParentTabs}: any) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        list: {
            flex: 1,
        },
        advertisingGroup: {
            paddingHorizontal: 20 - AdvertisingGroup.separatorSize,
        },
        listContentContainer: {
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
            paddingBottom: BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
        },
        section: {
            paddingHorizontal: 20,
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 4,
            minHeight: 40,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        groupsListContainer: {
            paddingHorizontal: 10,
            paddingBottom: 12,
            paddingTop: 1,
        },
        groupsRow: {
            flexDirection: 'row',
        },
        groupItem: {
            padding: 5,
            overflow: 'visible',
        },
    };
}
