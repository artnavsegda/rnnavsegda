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
        listContentContainer: (hasPrice: boolean) => ({
            paddingTop:
                NAV_BAR_HEIGHT +
                getContainerTopPadding(isModal) +
                ChooseAccountPopupLayer.accountButtonHeight +
                (hasPrice ? 90 : 45),
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
            paddingHorizontal: 20,
        }),
        loader: {
            minHeight: 64,
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
        },
        separator: {
            height: 0.75,
            width: '100%',
            marginVertical: 16,
            backgroundColor: Color(theme.colors.primaryText).alpha(theme.opacity.extra).toString(),
        },
        actionBlock: {
            paddingVertical: 20,
        },
        navBarInfo: {
            paddingHorizontal: 16,
        },
        serviceInfoBlock: {
            height: 68,
            marginTop: 10,
            paddingLeft: 16,
            paddingRight: 12,
            borderRadius: 16,
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.secondaryButton,
        },
        serviceIcon: {
            width: 46,
            height: 46,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
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
