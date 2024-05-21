import React from 'react';
import {Store} from 'redux';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import {Persistor} from 'redux-persist';
import {Navigation} from 'react-native-navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {splashBackgroundColor, ThemeProvider} from '../themes';

import {I18nBridge} from '../i18n';

import Faq from './Faq';
import Lock from './Lock';
import Alert from './Alert';
import LogIn from './LogIn';
import Splash from './Splash';
import Settings from './Settings';
import Contacts from './Contacts';
import FaqAnswer from './FaqAnswer';
import PasswordSet from './PasswordSet';
import EditProfile from './EditProfile';
import AccountInfo from './AccountInfo';
import SupportChat from './SupportChat';
import Confirmation from './Confirmation';
import ChooseAccount from './ChooseAccount';
import CreateAccount from './CreateAccount';
import Identification from './Identification';
import AccountDetails from './AccountDetails';
import AdvertisingInfo from './AdvertisingInfo';
import AboutAppService from './AboutAppService';
import ServiceForm from './Services/ServiceForm';
import ExternalPayment from './ExternalPayment';
import BlockGroups from './Services/BlockGroups';
import ChangeAccessCode from './ChangeAccessCode';
import GroupServices from './Services/GroupServices';
import ReplenishForm from './Services/ReplenishForm';
import QrTransferForm from './Services/QrTransferForm';
import LocalTransferForm from './Services/LocalTransferForm';
import CameraDetectClient from './Services/CameraDetectClient';
import NotificationsHistoryScreen from './NotificationsHistory';
import NotificationListScreen from './NotificationsHistory/NotificationList';
import NotificationModalScreen from './NotificationsHistory/NotificationModal';

import MenuTab from './Menu';
import CardsTab from './Cards';
import WelcomeTab from './Welcome';
import HistoryTab from './History';
import PaymentsTab from './Payments';

// noinspection SpellCheckingInspection
function registerComponentWithRedux(componentName, Component, store: Store, persistor: Persistor | null = null) {
    return Navigation.registerComponent(
        componentName,
        () => ({theme, ...props}: any) => {
            const themed = (
                <ThemeProvider theme={theme}>
                    <I18nBridge>{(language: string) => <Component {...props} language={language} />}</I18nBridge>
                </ThemeProvider>
            );
            // noinspection SpellCheckingInspection
            return (
                <Provider store={store}>
                    {persistor ? (
                        <PersistGate
                            loading={<View style={{flex: 1, backgroundColor: splashBackgroundColor}} />}
                            persistor={persistor}>
                            {themed}
                        </PersistGate>
                    ) : (
                        themed
                    )}
                </Provider>
            );
        },
        () => Component,
    );
}

// noinspection SpellCheckingInspection
export function registerScreens(store: Store, persistor: Persistor | null = null) {
    // Private method for fast registration screens
    const _fastRegistration = (Components: any[]): any => {
        return Components.map((Component: any) =>
            registerComponentWithRedux(
                Component.navigationName,
                Component,
                store,
                Component.usePersistor ? persistor : null,
            ),
        );
    };
    // Registration screens
    _fastRegistration([
        Faq,
        Lock,
        Alert,
        LogIn,
        Splash,
        MenuTab,
        CardsTab,
        Contacts,
        Settings,
        FaqAnswer,
        HistoryTab,
        WelcomeTab,
        AccountInfo,
        PasswordSet,
        PaymentsTab,
        SupportChat,
        EditProfile,
        BlockGroups,
        ServiceForm,
        Confirmation,
        CreateAccount,
        ChooseAccount,
        ReplenishForm,
        GroupServices,
        AccountDetails,
        Identification,
        QrTransferForm,
        AboutAppService,
        AdvertisingInfo,
        ChangeAccessCode,
        ExternalPayment,
        LocalTransferForm,
        CameraDetectClient,
        NotificationListScreen,
        NotificationsHistoryScreen,
        NotificationModalScreen,
    ]);
}
