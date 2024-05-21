// @flow
import type {Theme} from '../../../themes';
import {getContainerTopPadding, BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../../constants';

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
            paddingHorizontal: 10,
        },
        item: {
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 5,
            minHeight: 40,
        },
        itemIcon: (color: any) =>({
            backgroundColor: color,
            borderRadius: 8,
            marginRight: 12,
            padding: 12,
            height: 56,
            width: 56,
        }),
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        blockItemContainer: {
            padding: 5,
            overflow: 'visible',
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
