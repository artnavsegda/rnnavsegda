import type {Theme} from '../../themes';

import i18n from '../../i18n';

import {getNC as getMenuNC} from '../Menu';
import {getNC as getCardsNC} from '../Cards';
import {getNC as getWelcomeNC} from '../Welcome';
import {getNC as getPaymentsNC} from '../Payments';

function tabIconByKey(key: string): any {
    switch (key) {
        case 'welcome':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-welcome-tab.png');
        case 'cards':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-cards-tab.png');
        case 'payments':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-payments-tab.png');
        case 'transfers':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-transfer-tab.png');
        case 'history':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-history-tab.png');
        case 'menu':
            // noinspection JSUnresolvedFunction
            return require('../../resources/icons/ic-partitions-tab.png');
        default:
            return null;
    }
}

function bottomTabGetter(key: string): any {
    return {
        testID: `${key}Tab`,
        icon: tabIconByKey(key),
        text: i18n.t(`tabs.${key}`),
    };
}

export function getNC(theme: Theme, options: any = {}) {
    // noinspection SpellCheckingInspection
    const iconOptions: any = {
        fontSize: 11,
        fontFamily: 'Geometria',
        iconInsets: {top: 0, left: 0, bottom: 0, right: 0},
    };
    // noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols
    return {
        bottomTabs: {
            children: [
                {
                    stack: {
                        children: [
                            getWelcomeNC({
                                type: 0,
                                tabIndex: 0,
                                isParentTabs: true,
                                bottomTabGetter: () => bottomTabGetter('welcome'),
                            }),
                        ],
                        options: {
                            bottomTab: {
                                ...iconOptions,
                                ...bottomTabGetter('welcome'),
                            },
                        },
                    },
                },
                {
                    stack: {
                        children: [
                            getCardsNC({
                                type: 1,
                                tabIndex: 1,
                                isParentTabs: true,
                                bottomTabGetter: () => bottomTabGetter('cards'),
                            }),
                        ],
                        options: {
                            bottomTab: {
                                ...iconOptions,
                                ...bottomTabGetter('cards'),
                            },
                        },
                    },
                },
                {
                    stack: {
                        children: [
                            getPaymentsNC({
                                type: 2,
                                tabIndex: 2,
                                isParentTabs: true,
                                bottomTabGetter: () => bottomTabGetter('payments'),
                            }),
                        ],
                        options: {
                            bottomTab: {
                                ...iconOptions,
                                ...bottomTabGetter('payments'),
                            },
                        },
                    },
                },
                {
                    stack: {
                        children: [
                            getPaymentsNC({
                                type: 4,
                                tabIndex: 3,
                                isParentTabs: true,
                                bottomTabGetter: () => bottomTabGetter('transfers'),
                            }),
                        ],
                        options: {
                            bottomTab: {
                                ...iconOptions,
                                ...bottomTabGetter('transfers'),
                            },
                        },
                    },
                },
                {
                    stack: {
                        children: [
                            getMenuNC({
                                tabIndex: 4,
                                isParentTabs: true,
                                bottomTabGetter: () => bottomTabGetter('menu'),
                            }),
                        ],
                        options: {
                            bottomTab: {
                                ...iconOptions,
                                ...bottomTabGetter('menu'),
                            },
                        },
                    },
                },
            ],
            options: {
                topBar: {
                    visible: false,
                },
                sideMenu: {
                    right: {
                        enabled: true,
                    },
                },
                bottomTabs: {
                    visible: true,
                    currentTabIndex: 0,
                    titleDisplayMode: 'alwaysShow',
                },
                ...(options || {}),
            },
        },
    };
}
