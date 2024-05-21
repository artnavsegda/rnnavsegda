// @flow
import type {Theme} from '../../themes';
import {getContainerTopPadding, BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../constants';

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
        listContentContainer: {
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
        },
        link: {
            paddingHorizontal: 20,
            minHeight: 36,
        },
        partition: {
            paddingHorizontal: 20,
        },
        section: {
            paddingHorizontal: 20,
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 4,
            //minHeight: 40,
        },
        footer: {
            minHeight: 24,
        },
        partitionInfo: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
        },
        partitionWidget: {
            marginRight: 12,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
    };
}
