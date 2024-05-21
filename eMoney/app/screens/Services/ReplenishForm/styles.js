// @flow
import Color from 'color';
import {type Theme} from '../../../themes';
import {ChooseAccountPopupLayer} from '../../../components';
import {getContainerTopPadding, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, BOTTOM_SPACE} from '../../../constants';

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme, {isModal, isParentTabs}: any): any {
    const headerTintColor = Color(theme.colors.translations).isDark ? '#fff' : '#252525';
    return {
        headerTintColor,
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        list: {
            flex: 1,
        },
        listContentContainer: {
            paddingTop:
                NAV_BAR_HEIGHT + getContainerTopPadding(isModal) + ChooseAccountPopupLayer.accountButtonHeight + 12,
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
            paddingHorizontal: 20,
        },
        actionBlock: {
            paddingVertical: 20,
        },
        navBarInfo: {
            paddingHorizontal: 16,
        },
        accountButton: {
            height: 68,
            borderRadius: 16,
            alignSelf: 'stretch',
            paddingHorizontal: 16,
            backgroundColor: theme.colors.button,
        },
        accountNumberBlock: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
        },
        fixedNavBar: {
            backgroundColor: theme.colors.primaryBackground,
            position: 'absolute',
            paddingBottom: 8,
            right: 0,
            left: 0,
            top: 0,
        },
    };
}
