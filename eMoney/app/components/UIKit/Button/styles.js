//@flow
import Color from 'color';
import type {Theme} from '../../../themes';

export default function(theme: Theme): any {
    return {
        container: {
            minWidth: 50,
            minHeight: 50,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        loader: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        link: {
            small: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 14,
            },
            normal: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 18,
            },
            large: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 20,
            },
        },
        icon: {
            small: {
                backgroundColor: 'transparent',
                justifyContent: 'center',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 16,
                height: 16,
                width: 16,
            },
            normal: {
                backgroundColor: 'transparent',
                justifyContent: 'center',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 24,
                height: 24,
                width: 24,
            },
            large: {
                backgroundColor: 'transparent',
                justifyContent: 'center',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 32,
                height: 32,
                width: 32,
            },
        },
        uncontained: {
            small: {
                backgroundColor: 'transparent',
                paddingHorizontal: 12,
                paddingVertical: 6,
                minHeight: 32,
            },
            normal: {
                backgroundColor: 'transparent',
                minHeight: 50,
            },
            large: {
                backgroundColor: 'transparent',
                minHeight: 64,
            },
        },
        outlined: {
            small: {
                backgroundColor: 'transparent',
                borderColor: theme.colors.button,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                minHeight: 32,
            },
            normal: {
                backgroundColor: 'transparent',
                borderColor: theme.colors.button,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderWidth: 1,
                minHeight: 50,
            },
            large: {
                borderColor: theme.colors.button,
                backgroundColor: 'transparent',
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderWidth: 1,
                minHeight: 64,
            },
        },
        text: {
            small: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 14,
            },
            normal: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 18,
            },
            large: {
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 20,
            },
        },
        action: {
            small: {
                backgroundColor: theme.colors.primaryBackground,
                paddingVertical: 6,
                borderRadius: 0,
                minHeight: 26,
            },
            normal: {
                backgroundColor: theme.colors.primaryBackground,
                paddingVertical: 8,
                borderRadius: 0,
                minHeight: 40,
            },
            large: {
                backgroundColor: theme.colors.primaryBackground,
                paddingVertical: 10,
                borderRadius: 0,
                minHeight: 48,
            },
        },
        contained: {
            small: {
                backgroundColor: theme.colors.button,
                paddingHorizontal: 12,
                paddingVertical: 6,
                minHeight: 32,
            },
            normal: {
                backgroundColor: theme.colors.button,
            },
            large: {
                backgroundColor: theme.colors.button,
                minHeight: 64,
            },
        },
        loaderColors: {
            link: theme.colors.link,
            icon: theme.colors.button,
            action: theme.colors.button,
            outlined: theme.colors.button,
            text: theme.colors.primaryText,
            uncontained: theme.colors.button,
            contained: theme.colors.buttonText,
        },
        textColors: {
            link: 'link',
            text: 'button',
            icon: 'button',
            action: 'button',
            outlined: 'button',
            uncontained: 'button',
            contained: theme.colors.buttonText,
        },
        underlayColors: {
            link: Color(theme.colors.link)
                .alpha(0.1)
                .toString(),
            text: Color(theme.colors.button)
                .alpha(0.1)
                .toString(),
            icon: Color(theme.colors.button)
                .alpha(0.1)
                .toString(),
            outlined: Color(theme.colors.button)
                .alpha(0.1)
                .toString(),
            uncontained: Color(theme.colors.button)
                .alpha(0.1)
                .toString(),
            action: Color(theme.colors.button)
                .alpha(0.1)
                .toString(),
        },
        textSizes: {
            small: 12,
            large: 20,
            normal: 16,
        },
    };
}
