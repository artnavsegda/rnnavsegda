// @flow
import type {Theme} from '../../themes';

// noinspection JSUnusedLocalSymbols
export default function(theme: Theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.primaryBackground,
        },
    };
}
