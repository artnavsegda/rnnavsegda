// @flow
import type {Theme} from '../../themes';
import {AdvertisingGroup} from '../../components';
import {getContainerTopPadding, TAB_BAR_HEIGHT, NAV_BAR_HEIGHT, BOTTOM_SPACE} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme, {isModal, isParentTabs}: any): any {
    return {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primaryBackground,
        },
        emptyInfoBlock: {
            width: '80%',
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'center',
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        list: {
            flex: 1,
        },
        cards: {
            marginBottom: 32,
        },
        cardsTable: {
            marginTop: 24,
            flexWrap: 'wrap',
            marginRight: -10,
            flexDirection: 'row',
        },
        cardCell: {
            width: '50%',
            paddingRight: 10,
            marginBottom: 10,
            aspectRatio: 1.5,
        },
        section: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 4,
            minHeight: 40,
        },
        content: {
            paddingHorizontal: 20,
            paddingBottom: 16,
        },
        advertisingGroup: {
            paddingHorizontal: 20 - AdvertisingGroup.separatorSize,
        },
        listContentContainer: {
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
            paddingBottom: 16 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
        },
        addAccount: {
            width: '100%',
            height: '100%',
            borderWidth: 3,
            flexDirection: 'column',
            borderColor: theme.colors.secondaryBackground,
        },
        addExternalCard: {
            width: '100%',
            borderWidth: 3,
            borderRadius: 6,
            borderColor: theme.colors.secondaryBackground,
        },
    };
}
