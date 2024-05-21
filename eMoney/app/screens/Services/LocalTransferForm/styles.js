// @flow
import Color from 'color';
import {type Theme} from '../../../themes';
import {ChooseAccountPopupLayer} from '../../../components';
import {getContainerTopPadding, BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../../constants';

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
                NAV_BAR_HEIGHT + getContainerTopPadding(isModal) + ChooseAccountPopupLayer.accountButtonHeight * 2 + 24,
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
            paddingHorizontal: 20,
        },
        separtor: {
            left: 0,
            right: 0,
            bottom: 0,
            height: 0.75,
            position: 'absolute',
            backgroundColor: Color(theme.colors.primaryText).alpha(theme.opacity.extra).toString(),
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
        secondaryAccountButton: {
            backgroundColor: theme.colors.secondaryButton,
        },
        accountNumberBlock: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
        },
        swapAccountsIcon: {
            width: 24,
            height: 24,
            tintColor: theme.colors.secondaryButton,
        },
        swapAccountsButton: {
            width: 48,
            height: 48,
            borderRadius: 24,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: headerTintColor,
            right: ChooseAccountPopupLayer.accountButtonHeight - 12,
            bottom: ChooseAccountPopupLayer.accountButtonHeight / 2 + 20,
        },
        fixedNavBar: {
            backgroundColor: theme.colors.primaryBackground,
            position: 'absolute',
            paddingBottom: 8,
            right: 0,
            left: 0,
            top: 0,
        },
        fieldAccessory: {
            minWidth: 21,
            minHeight: 21,
            alignItems: 'center',
        },
        fieldAccessoryIcon: {
            width: 21,
            height: 21,
            tintColor: theme.colors.button,
        },
    };
}
