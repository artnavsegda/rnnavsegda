// @flow
import Color from 'color';
import type {Theme} from '../../themes';
import {NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import {elevationStyle} from '../../themes';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        list: {
            flex: 1,
            minWidth: 1,
            minHeight: 1,
            transform: [{scaleY: -1}],
        },
        listContentContainer: {
            paddingBottom: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
            paddingTop: 16,
        },
        row: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'center',
            transform: [{scaleY: -1}],
        },
        rowSpacer: {
            flex: 1,
        },
        messageText: {
            color: theme.colors.primaryText,
        },
        outgoingMessageText: {
            color: theme.colors.buttonText,
        },
        messageBlock: {
            paddingTop: 12,
            borderRadius: 12,
            paddingBottom: 8,
            paddingHorizontal: 16,
            ...elevationStyle(8, 'rgba(0,0,0,0.15)'),
        },
        incomingMessageStyle: {
            backgroundColor: theme.colors.secondaryBackground,
            alignItems: 'flex-start',
            borderTopLeftRadius: 0,
        },
        outgoingMessageStyle: {
            backgroundColor: theme.colors.button,
            borderColor: 'transparent',
            borderTopRightRadius: 0,
            alignItems: 'flex-end',
        },
        dateHeaderItem: {
            height: '100%',
            borderRadius: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'center',
            backgroundColor: theme.colors.primaryBackground,
        },
        fixedNavBar: {
            backgroundColor: theme.colors.primaryBackground,
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        input: {
            ...fontStyles.regular,
            color: theme.colors.primaryText,
            paddingHorizontal: 0,
            paddingVertical: 0,
            marginRight: 10,
            lineHeight: 22,
            minHeight: 24,
            fontSize: 18,
            flex: 1,
        },
        sendIcon: {
            width: 24,
            height: 24,
            tintColor: theme.colors.button,
        },
        sendButton: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputToolbar: {
            minHeight: 56,
            paddingLeft: 20,
            paddingRight: 0,
            alignItems: 'center',
            flexDirection: 'row',
            borderTopWidth: 0.75,
            justifyContent: 'space-between',
            backgroundColor: theme.colors.secondaryBackground,
            borderTopColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
        },
    };
}
