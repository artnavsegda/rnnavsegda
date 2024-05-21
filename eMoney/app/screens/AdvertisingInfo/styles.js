// @flow
import type {Theme} from '../../themes';
import {getContainerTopPadding, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, BOTTOM_SPACE} from '../../constants';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import {elevationStyle} from '../../themes';
import Color from 'color';

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
        image: {
            width: '100%',
            borderRadius: 16,
            marginBottom: 24,
            aspectRatio: 1.78,
            backgroundColor: Color(theme.colors.primaryText)
                .alpha(0.15)
                .toString(),
            ...elevationStyle(10),
        },
        listContentContainer: {
            paddingHorizontal: 20,
            paddingBottom: 14 + BOTTOM_SPACE + (!isModal && isParentTabs ? TAB_BAR_HEIGHT : 0),
            paddingTop: NAV_BAR_HEIGHT + getContainerTopPadding(isModal),
        },
        fixedNavBar: {
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
        },
        linkBlock: {
            paddingTop: 20,
            paddingBottom: 20,
        },
        descriptionMarkdown: {
            view: {
                alignSelf: 'stretch',
            },
            heading1: {
                ...fontStyles.medium,
                fontSize: 18,
                lineHeight: 24,
                color: theme.colors.primaryText,
            },
            heading2: {
                ...fontStyles.regular,
                fontSize: 18,
                lineHeight: 24,
                color: theme.colors.primaryText,
            },
            strong: {
                ...fontStyles.bold,
                fontSize: 16,
                lineHeight: 20,
                color: theme.colors.primaryText,
            },
            em: {
                ...fontStyles.regular,
                fontSize: 16,
                lineHeight: 22,
                color: theme.colors.secondaryText,
            },
            text: {
                ...fontStyles.regular,
                fontSize: 16,
                lineHeight: 20,
                color: theme.colors.primaryText,
            },
            blockQuoteText: {
                ...fontStyles.regular,
                fontSize: 16,
                lineHeight: 20,
                color: theme.colors.secondaryText,
            },
            blockQuoteSection: {
                flexDirection: 'row',
            },
            blockQuoteSectionBar: {
                width: 3,
                height: null,
                marginRight: 16,
                backgroundColor: '#DDDDDD',
            },
            codeBlock: {
                ...fontStyles.regular,
                backgroundColor: '#DDDDDD',
            },
            tableHeader: {
                backgroundColor: '#DDDDDD',
            },
        },
    };
}
