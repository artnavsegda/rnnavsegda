/* flow-disable */
import _ from 'lodash';
import shortId from 'shortid';

// Other export
export * from './sizes';
export * from './enums';
export * from './models';
export * from './fetching';
export * from './defaults';

export const __DEMO__ = false;

export const API_URL: string = __DEMO__
    ? 'http://demo.cyberiasoft.com/eMoneyService/api'
    : 'https://prod.emoneyapp.co/eMoneyService/api';

// Auth API
export const API_AUTH = 'api/auth';

// Client API
export const API_CLIENT_EDIT = 'api/client/edit';
export const API_CLIENT_LOGOFF = 'api/client/logOff';
export const API_GET_CLIENT_INFO = 'api/client/getInfo';
export const API_CLIENT_SET_AVATAR = 'api/client/setAvatar';
export const API_CLIENT_REQUEST_LOGIN = 'api/client/requestLogin';
export const API_CLIENT_CONFIRM_LOGIN = 'api/client/confirmLogin';
export const API_CLIENT_REPEAT_SMS_CODE = 'api/client/repeatSmsCode';
export const API_IDENTIFICATION_CLIENT = 'api/client/identification';
export const API_CLIENT_REPEAT_EMAIL_CONFIRM = 'api/client/repeatEmailConfirm';

// Faq API
export const API_FAQ_GET_ITEMS = 'api/faq/getItems';
export const API_FAQ_GET_ANSWERS = 'api/faq/getAnswers';

// Support API
export const API_SUPPORT_GET_ITEMS = 'api/support/getItems';
export const API_SUPPORT_SEND_MESSAGE = 'api/support/sendMessage';

// Services API
export const API_SERVICES_GET_GROUPS = 'api/services/getGroups';
export const API_SERVICES_GET_GROUP_ITEMS = 'api/services/getGroupItems';
export const API_SERVICES_FIND_INFO_BY_ID = 'api/services/findInfoById';

// Accounts API
export const API_AVAILABLE_CURRENCIES = 'api/accounts/getAvailableCurrencies';
export const API_ACCOUNT_CREATE = 'api/accounts/create';
export const API_ACCOUNTS_GET = 'api/accounts/get';

// Advertising API
export const API_ADVERTISING = 'api/advertising';
export const API_ADVERTISING_GET_GROUPS = 'api/advertising/getGroups';

// History API
export const API_HISTORY_GET_ITEMS = 'api/history/getItems';

// Operations
export const OP_SET_STATE = 'op/setState';
export const OP_CHANGE_THEME = 'op/changeTheme';
export const OP_DEV_CHANGE_LOCALE = 'op/dev/changeLocale';
export const OP_CHANGE_NET_INDICATOR = 'op/changeNetState';
export const OP_CHANGE_APP_INDICATOR = 'op/changeAppState';
export const OP_CHANGE_ACCESS_HASH = 'op/client/changeAccessHash';

export const OP_CHANGE_FETCHING = 'op/fetching';

// Masks
export const PHONE_MASK_RU: string = '+9 999 999 99 999';
export const PHONE_MASK_KZ: string = '+999 99 999 99 99';

// Access code length
export const ACCESS_CODE_INPUT_SIZE = 4;
export const FILLED_CODE = _.repeat('#', ACCESS_CODE_INPUT_SIZE);

// Startup ID
export const STARTUP_APP_SHORT_ID = shortId.generate();

export const SQ_SIGN_KEY = 'em98231';

// Application ACTIONS
export const APP_ADD_NOTIFICATION = 'app/addNotification';
export const APP_DELETE_ALL_NOTIFICATION_BY_TYPE = 'app/deleteAllNotificationByType';
export const APP_CHANGE_PUSH_NOTIFICATIONS_STATUS = 'app/changePushNotificationsStatus';

// Notifications API
export const API_NOTIFICATIONS_GET_TOP = 'api/notifications/top';
export const API_NOTIFICATIONS_PUSH_LIST = 'api/notifications/push/list';
export const API_NOTIFICATIONS_BONUSES_LIST = 'api/notifications/bonuses/list';
export const API_NOTIFICATIONS_PAYMENTS_LIST = 'api/notifications/payments/list';
export const API_NOTIFICATIONS_CLEAR_NOTIFICATION_LIST = 'api/notifications/clear/notification/list';

/* flow-enable */
