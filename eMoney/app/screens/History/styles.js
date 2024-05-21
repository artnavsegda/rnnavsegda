// @flow
import Color from 'color';
import type {Theme} from '../../themes';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import {getContainerTopPadding, BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme, {isModal, isParentTabs}: any) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        toolbar: {
            paddingBottom: 8,
            paddingHorizontal: 10,
        },
        listContentContainer: {
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal) + 40,
            paddingBottom: BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0) + 40,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        historyItem: {
            width: '100%',
            paddingHorizontal: 20,
        },
        timeBlock: {
            height: 36,
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
        },
        historyItemImage: {
            width: 40,
            height: 40,
            marginRight: 10,
            borderRadius: 8,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
        },
        historyItemLeftSpacer: {
            marginRight: 10,
            width: 40,
        },
        segmentedControl: {
            borderRadius: 7,
            tabStyle: {
                backgroundColor: 'transparent',
                borderColor: Color(theme.colors.primaryText)
                    .alpha(theme.opacity.spoon)
                    .toString(),
                minHeight: 32,
            },
            tabTextStyle: {
                ...fontStyles.regular,
                color: theme.colors.primaryText,
                fontSize: 11,
            },
            activeTabStyle: {
                backgroundColor: theme.colors.button,
                borderColor: theme.colors.button,
            },
            activeTabTextStyle: {
                ...fontStyles.bold,
                color: theme.colors.buttonText,
                fontWeight: 'bold',
                fontSize: 11,
            },
        },
    };
}
