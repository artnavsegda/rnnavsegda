//@flow
import {Store, getState, setStore} from './store';

import exchangerates from './exchangerates';
import notifications from './notifications';
import advertising from './advertising';
import indicators from './indicators';
import currencies from './currencies';
import services from './services';
import invoice from './invoice';
import accounts from './accounts';
import support from './support';
import history from './history';
import algolia from './algolia';
import client from './client';
import files from './files';
import theme from './theme';
import auth from './auth';
import faq from './faq';
import dev from './dev';

export default {
    api: {
        faq,
        auth,
        files,
        client,
        support,
        history,
        invoice,
        services,
        accounts,
        currencies,
        advertising,
        exchangerates,
        notifications,
    },
    dev,
    theme,
    algolia,
    indicators,
    redux: {
        getState,
    },
    involveStore: (store: Store): Store => {
        return setStore(store);
    },
    app: {
        notifications,
    },
};
