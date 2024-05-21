// @flow
import type {Theme} from '../../../themes';
import {
    getContainerTopPadding,
    BOTTOM_SPACE,
    NAV_BAR_HEIGHT,
    TAB_BAR_HEIGHT,
} from '../../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme, {isModal, isParentTabs}: any): any {
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
        item: {
            paddingHorizontal: 20,
            paddingVertical: 5,
            minHeight: 40,
        },
        itemIcon: {
            borderRadius: 8,
            marginRight: 12,
            height: 40,
            width: 40,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
    };
}
