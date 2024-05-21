// @flow

// Тип локации отображения раздела
export const PartitionViewTypes = {
    hidden: 0, // Скрыть
    main: 1, // Показывать на главной и в меню
    view: 2, // Показывать только в меню
};

export const SupportedPartitions = {
    pay: 'pay',
    qrcode: 'qrcode',
    history: 'history',
    transfer: 'transfer',
    recharge: 'recharge',
    notificationsHistory: 'notifications',
};

export const NotificationsTypes = {
    0: 'actions',
};

export const ServiceFieldTypes = {
    label: 3,
    button: 5,
    textbox: 0,
    combobox: 1,
    checkbox: 2,
    separator: 4,
    hasValue: (type: number) => {
        return type !== ServiceFieldTypes.label && type < ServiceFieldTypes.separator;
    },
};

export const ServiceFieldKeyboardTypes = {
    none: 0,
    text: 1,
    phone: 3,
    email: 4,
    number: 2,
    datetime: 5,
    cardNumber: 6,
    hasInputTrimm: (type: number) => {
        return type <= ServiceFieldKeyboardTypes.text && type !== ServiceFieldKeyboardTypes.datetime;
    },
};

export const ServiceTypes = {
    simple: 0,
    select: 1,
    complex: 2,
    transfer: 3,
    name: (type: number) => {
        switch (type) {
            case ServiceTypes.simple:
                return 'simple';
            case ServiceTypes.select:
                return 'select';
            case ServiceTypes.complex:
                return 'complex';
            case ServiceTypes.transfer:
                return 'transfer';
            default:
                return `st.${type}`;
        }
    },
};
