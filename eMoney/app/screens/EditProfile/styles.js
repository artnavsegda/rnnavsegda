// @flow
import type {Theme} from '../../themes';
import {getContainerTopPadding, BOTTOM_SPACE, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT} from '../../constants';

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
            paddingHorizontal: 20,
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
            paddingBottom: 20 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0) + 100,
        },
        toolbar: {
            backgroundColor: theme.colors.primaryBackground,
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: 8,
        },
        field: {
            paddingTop: 8,
            paddingBottom: 4,
            flexDireaction: 'column',
        },
        fieldContent: {
            minHeight: 28,
            paddingVertical: 8,
            paddingHorizontal: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.secondaryText,
        },
        datePickerBlock: {
            paddingBottom: 12,
            minHeight: 132,
            paddingTop: 4,
        },
        genderListWrapper: {
            flexDirection: 'row',
            paddingVertical: 10,
        },
        languagesBlock: {
            flexDirection: 'row',
            paddingTop: 10,
            flexWrap: 'wrap',
        },
        repeatEmail: {
            minWidth: 21,
            minHeight: 21,
            alignItems: 'center',
        },
        repeatEmailIcon: {
            width: 21,
            height: 21,
            tintColor: theme.colors.errorText,
        },
        citiesBlock: {
            flexDirection: 'row',
            paddingTop: 10,
            flexWrap: 'wrap',
        },
        actionBlock: {
            paddingTop: 20,
            paddingBottom: 20,
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
    };
}
