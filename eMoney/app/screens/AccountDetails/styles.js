// @flow
import type {Theme} from '../../themes';
import {getContainerTopPadding, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, BOTTOM_SPACE} from '../../constants';

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
        content: {
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        action: {
            paddingHorizontal: 20,
        },
        actionInfo: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
        },
        actionIcon: {
            width: 24,
            height: 24,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
    };
}
