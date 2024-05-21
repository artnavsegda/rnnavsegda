// @flow
import Color from 'color';
import type {Theme} from '../../themes';
import {getContainerTopPadding, MIN_SCREEN_SIZE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, BOTTOM_SPACE} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme, {isModal, isParentTabs}: any): any {
    const avatarSize = (MIN_SCREEN_SIZE - 40) * 0.4;
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        list: {
            flex: 1,
        },
        link: {
            minHeight: 32,
        },
        section: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 4,
            minHeight: 32,
        },
        listContentContainer: {
            paddingHorizontal: 20,
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        editProfileBlock: {
            paddingTop: 16,
            paddingBottom: 24,
            alignSelf: 'flex-start',
        },
        avatar: {
            width: avatarSize,
            height: avatarSize,
            marginBottom: 12,
            borderRadius: avatarSize / 2,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
        },
        avatarOverlay: {
            flex: 1,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        setAvatarIconSize: avatarSize * 0.234,
    };
}
