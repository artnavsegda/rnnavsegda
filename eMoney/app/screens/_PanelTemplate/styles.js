// @flow
import type {Theme} from '../../themes';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        bps: {
            panel: {
                backgroundColor: theme.colors.primaryBackground,
            },
            backdrop: {
                backgroundColor: 'rgba(0,0,0,0.6)',
            },
        },
    };
}
