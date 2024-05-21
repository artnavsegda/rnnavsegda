// @flow
// Раздел
export type Partition = {
    code: string, // Уникальный код раздела
    name: string, // Имя раздела
    color: string, // Цвет для фона иконок разделов
    picture: string, // Изображение для раздела в формате {id}/{time}.{ext} (пример url - /api/file/:id/:alias)
    isUser: boolean, // Только для авторизированных пользователей
    viewType?: number, // тип отрисовки
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type Account = {
    currency: string,
    balance: number,
    points: number,
    number: string,
};

export type AccountCurrency = {
    alfa3: string,
    isAccount: boolean,
    // Сгенерированные поля
    index: number, // Индекс позиции
};

// Данные клиента
export type ClientInfo = {
    clientGuid: string,
    city?: string,
    name?: string,
    phone: number,
    email?: string,
    gender?: number,
    picture?: string,
    country?: string,
    currency: string,
    language: string,
    accounts: Account[],
    dateOfBirth?: number,
    confirmedPhone: boolean,
    confirmedEmail: boolean,
    identification: number, // 0, 1, 2
};

export type FAQQuestion = {
    id: number,
    question: string,
};

export type FAQ = {
    question: string,
    answer: string,
};

export type FAQGroup = {
    id: number,
    name: string,
    questions: FAQQuestion[],
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type SupportMessage = {
    id: number,
    date: number,
    text: string,
    manager?: string,
    managerId?: number,
    // Сгенерированные поля
    index: number, // Индекс позиции
    fontSize: number, // Размер шрифта для текста
    textHeight?: number, // Высота текста с учетом отступов
};

export type Advertising = {
    id: number,
    name: string,
    url?: string,
    type: number,
    width: number,
    height: number,
    autoOpen: boolean,
    serviceId?: number,
    colorText?: string,
    mainPicture: string,
    moduleCode?: string,
    cartPicture: string,
    description?: string,
    serviceGroupId?: number,
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type AdvertisingBlock = {
    id: number,
    name: string,
    viewType: number,
    location: number, // 0, 1, 2
    advertising: Advertising[],
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type Service = {
    id: number,
    code: string,
    name: string,
    type: number,
    picture: string,
    currency: string,
    isBonus?: boolean,
    isAutoPay?: boolean,
    isFavourite?: boolean,
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type ServiceGroup = {
    id: number,
    name: string,
    picture: string,
    viewType: number,
    service?: Service,
    colorCart?: string,
    colorPicture?: string,
};

export type ServiceBlock = {
    id: number,
    name: string,
    type: number, // 0 - pay, 1 - transfer, 2 - recharge
    viewType: number,
    groups: ServiceGroup[],
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type ServiceField = {
    code: string,
    type: number,
    value?: string,
    format?: string,
    caption: string,
    keyboard: number,
    isRequired?: boolean,
    description?: number,
    isReadOnly?: boolean,
    items?: {[key: string]: string},
};

export type RateResult = {
    currencyFrom: string,
    currencyTo: string,
    quantity: number,
    sale: number,
    pay: number,
};

export type ExchangeRateResult = RateResult & {
    basis: boolean,
};

export type HistoryItem = {
    id: number,
    date: number,
    name: string,
    price: number,
    status: number,
    account?: string,
    picture?: string,
    bonusSpend: number,
    description?: string,
    client2Name?: string,
    currencyAlfa3: string,
    bonusReceived: number,
    colorPicture?: string,
    // Сгенерированные поля
    index: number, // Индекс позиции
};

export type PushMessage = {
    id: string,
    type: number,
    messageData: any,
};
