// @flow
import type {Theme} from '../../themes';
import {__DEMO__} from '../../constants';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
            flexDirection: 'column',
        },
        versionBlock: {
            marginTop: 8,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        link: {
            minHeight: 36,
        },
        serviceLogo: {
            height: 49,
            maxWidth: '65%',
            aspectRatio: 3.93,
        },
        varsionBadge: {
            marginTop: 9,
            marginLeft: 6,
            paddingTop: 2,
            borderRadius: 4,
            paddingBottom: 1,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: __DEV__ ? '#000000' : __DEMO__ ? '#d66a17' : '#179AD6',
        },
    };
}
