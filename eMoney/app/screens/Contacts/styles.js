// @flow
import Color from 'color';
import {Platform} from 'react-native';
import type {Theme} from '../../themes';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import {BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        listContentContainer: {
            paddingTop: NAV_BAR_HEIGHT + Platform.select({ios: 48, android: 80}),
            paddingBottom: BOTTOM_SPACE + TAB_BAR_HEIGHT,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        contactButton: {
            flex: 1,
            minHeight: '100%',
            paddingHorizontal: 20,
        },
        loader: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchBar: {
            paddingBottom: 10,
            paddingHorizontal: 10,
        },
        searchInputBlock: {
            minHeight: 36,
            borderRadius: 8,
            alignSelf: 'stretch',
            paddingHorizontal: 12,
            backgroundColor: Color(theme.colors.primaryText).alpha(0.1).toString(),
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            minHeight: 28,
            ...fontStyles.regular,
            color: theme.colors.primaryText,
        },
        contactThumbnail: {
            width: 44,
            height: 44,
            marginRight: 12,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color(theme.colors.primaryText).alpha(0.15).toString(),
        },
    };
}
