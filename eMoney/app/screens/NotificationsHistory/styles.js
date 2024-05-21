// @flow
import type {Theme} from '../../themes';
import Color from 'color';

// noinspection JSUnusedLocalSymbols
export default function (theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: '#EDEEF2',
        },
        sectionListContainer: {
            paddingHorizontal: 8,
            paddingBottom: 132,
            backgroundColor: '#EDEEF2',
        },
        sectionContainer: {
            flexDirection: 'row',
            minHeigth: 87,
            // backgroundColor: '#ff3567',
        },
        infoContainer: {
            marginLeft: 8,
            flex: 1,
            justifyContent: 'flex-start',
        },
        sectionHeaderText: {
            fontSize: 24,
            color: '#252525',
        },
        sectionSubheaderText: {
            //  fontSize: 12,
            color: '#929292',
        },
        rightContainer: {
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        badgeContainer: {
            width: 25,
            height: 18,
            backgroundColor: '#FA675F',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 32,
        },
        dateText: {
            fontSize: 12,
            color: '#929292',
        },
        badgeText: {
            fontSize: 12,
            color: '#fff',
        },
        notificationContainer: {
            minHeight: 64,
            borderRadius: 8,
            marginBottom: 4,
            paddingHorizontal: 8,
            //   backgroundColor: '#ff3456',
        },
        notificationContainerInfoBlock: {
            flex: 1,
            flexDirection: 'column',
        },
        bps: {
            panel: {
                backgroundColor: theme.colors.primaryBackground,
            },
            backdrop: {
                backgroundColor: 'rgba(0,0,0,0.6)',
            },
        },
        notificationModalContainer: {
            padding: 20,
        },
        historyItem: {
            width: '100%',
            paddingVertical: 20,
            backgroundColor: '#EDEEF2',
            minHeight: 64,
            borderRadius: 8,
            marginBottom: 4,
            paddingHorizontal: 8,
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
            backgroundColor: Color(theme.colors.primaryText).alpha(0.15).toString(),
        },
        historyItemLeftSpacer: {
            marginRight: 10,
            width: 40,
        },
        invoiceContainer: {
            flexDirection: 'row',
        },
        invoiceDataContainer: {
            flex: 1,
            borderRadius: 16,
            backgroundColor: '#fff',
            padding: 16,
        },
        invoiceSummText: {
            color: '#252525',
        },
        invoiceDateContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        invoiceActionContainer: {
            marginTop: 6,
            marginLeft: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    };
}
