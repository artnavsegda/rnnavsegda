// @flow
import { AppState, UIManager, InteractionManager, AsyncStorage } from 'react-native';
import { Store, createStore, applyMiddleware } from 'redux';
import NetInfo from '@react-native-community/netinfo';
import { Navigation } from 'react-native-navigation';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import axios from 'axios';

import doing from './doing';
import reducers from './reducers';
import { registerScreens } from './screens';
import { axiosCamelTransformer } from './utils';
import { themeByName, type Theme } from './themes';

import { getNC as getSplashNC } from './screens/Splash';

const { composeWithDevTools } = __DEV__
    ? require('redux-devtools-extension')
    : require('redux-devtools-extension/logOnlyInProduction');

let store: Store = doing.involveStore(createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))),
    persistor: any = persistStore(store),
    // eslint-disable-next-line no-unused-vars
    rootComponentId: string | null = null,
    themeName: string = '';

// Register screens
registerScreens(store, persistor);

// Use camel response data transformer
axios.defaults.transformResponse = [].concat(axiosCamelTransformer, axios.defaults.transformResponse);

// Update default options
function updateDefaultOptions(theme: ?Theme = null) {
    Navigation.setDefaultOptions({
        statusBar: {
            style: 'default',
            drawBehind: true,
            backgroundColor: 'transparent',
        },
        layout: {
            orientation: ['portrait'],
            ...(theme
                ? {
                    backgroundColor: theme.colors.primaryBackground,
                    componentBackgroundColor: theme.colors.primaryBackground,
                }
                : {}),
        },
        topBar: {
            visible: false,
            drawBehind: true,
            background: {},
            backButton: {},
        },
        bottomTabs: {
            animate: true,
            drawBehind: true,
            ...(theme
                ? {
                    backgroundColor: theme.colors.secondaryBackground,
                }
                : {}),
        },
        ...(theme
            ? {
                bottomTab: {
                    iconColor: theme.colors.secondaryText,
                    textColor: theme.colors.secondaryText,
                    selectedIconColor: theme.colors.link,
                    selectedTextColor: theme.colors.link,
                },
            }
            : {}),
        animations: {
            setRoot: {
                waitForRender: true,
                enabled: true,
            },
            showOverlay: {
                waitForRender: true,
                enabled: true,
                alpha: {
                    to: 1,
                    from: 0,
                    duration: 400,
                    interpolation: 'accelerate',
                },
            },
            dismissOverlay: {
                alpha: {
                    to: 0,
                    from: 1,
                    duration: 400,
                    interpolation: 'accelerate',
                },
            },
            setStackRoot: {
                waitForRender: true,
                enabled: true,
                alpha: {
                    to: 1,
                    from: 0,
                    duration: 400,
                    interpolation: 'accelerate',
                },
            },
            push: {
                waitForRender: true,
                enabled: true,
            },
            showModal: {
                waitForRender: true,
                enabled: true,
            },
        },
    });
}

function setRoot(skipSecurity: boolean = false) {
    return Navigation.setRoot({
        root: {
            stack: {
                children: [
                    getSplashNC({
                        skipSecurity,
                    }),
                ],
            },
        },
    }).then((componentId) => {
        rootComponentId = componentId;
    });
}

// Main app function
export default function start() {
    NetInfo.fetch().then((state) => {
        const _next = state.type === 'none' || state.type === 'unknown' ? 'offline' : 'online';
        if (_next !== 'online') {
            doing.indicators.setNetState(_next);
        }
    });
    AppState.addEventListener('change', (state: string) => {
        doing.indicators.setAppState(state);
    });
    NetInfo.addEventListener((state) => {
        doing.indicators.setNetState(state.type === 'none' || state.type === 'unknown' ? 'offline' : 'online');
    });
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // Run application
    Navigation.events().registerAppLaunchedListener(() => {
        // Set default options for navigation
        updateDefaultOptions();
        // Detect change theme
        store.subscribe(() => {
            const name = (store.getState().theme || {}).name;
            if (!name || themeName === name) {
                return;
            }
            const changed = themeName.length > 1 && name.length > 1;
            // Save theme name
            themeName = name;
            if (themeName.length < 1) {
                return;
            }
            const theme = themeByName(themeName);
            if (!theme) {
                return;
            }
            updateDefaultOptions(theme);
            if (changed) {
                return setRoot(false);
            }
        });
        return setRoot(false);
    });
}
