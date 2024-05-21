//@flow
import type {Theme} from '../../themes';

export default function(theme: Theme): any {
    return {
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: {
            width: 16,
            height: 16,
            tintColor: theme.colors.button,
        },
    };
}
