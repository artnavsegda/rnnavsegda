//@flow
import {__DEMO__} from '../constants';
import {persistCombineReducers} from 'redux-persist';
import storage from '@react-native-community/async-storage';

import faq, {type ReduxState as FaqReduxState} from './faq';
import auth, {type ReduxState as AuthReduxState} from './auth';
import theme, {type ReduxState as ThemeReduxState} from './theme';
import client, {type ReduxState as ClientReduxState} from './client';
import history, {type ReduxState as HistoryReduxState} from './history';
import support, {type ReduxState as SupportReduxState} from './support';
import fetching, {type ReduxState as FetchingReduxState} from './fetching';
import services, {type ReduxState as ServicesReduxState} from './services';
import indicators, {type ReduxState as StatesReduxState} from './indicators';
import partitions, {type ReduxState as PartitionsReduxState} from './partitions';
import advertising, {type ReduxState as AdvertisingReduxState} from './advertising';
import availableCurrencies, {type ReduxState as CurrenciesReduxState} from './availableCurrencies';
import pushNotifications, {type ReduxState as PushNotificationsState} from './notifications';

import utils from './utils';

const persistConfig: any = {
    key: __DEMO__ ? 'demo' : 'root',
    version: 20,
    storage,
    whitelist: ['theme', 'faq', 'auth', 'client', 'partitions', 'services', 'advertising', 'availableCurrencies'],
};

const reducers: any = {
    faq,
    auth,
    theme,
    client,
    support,
    history,
    fetching,
    services,
    indicators,
    partitions,
    advertising,
    availableCurrencies,
    pushNotifications,
};

export type ReduxState = {
    faq: FaqReduxState,
    auth: AuthReduxState,
    theme: ThemeReduxState,
    client: ClientReduxState,
    support: SupportReduxState,
    history: HistoryReduxState,
    services: ServicesReduxState,
    fetching: FetchingReduxState,
    indicators: StatesReduxState,
    partitions: PartitionsReduxState,
    advertising: AdvertisingReduxState,
    availableCurrencies: CurrenciesReduxState,
    pushNotifications: PushNotificationsState,
};

// noinspection JSUnusedGlobalSymbols
export const ReduxUtils = utils;

export default persistCombineReducers(persistConfig, reducers);
