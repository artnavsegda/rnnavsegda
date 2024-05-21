// prettier-ignore
export default {
    search: 'Search',
    commons:{
        information: 'Информация',
    },
    number: {
        currency: {
            format: {
                unit: '₽',
                precision: 2,
                format: '% n% u',
                sign_first: false,
                delimiter: '',
                separator: ',',
            },
        },
    },
    currencies: {
        KZT: 'Kazakhstani Tenge',
        RUB: 'Russian rouble',
        RUR: 'USSR ruble',
        USD: 'US Dollar',
        EUR: 'Euro',
        JPY: 'Japanese yen',
        KGS: 'Kyrgyzstani Som',
    },
    exchangeRates: {
        pay: 'pay',
        sale: 'sale',
    },
    calendar: {
        sameDay: 'Today',
        nextDay: 'Tomorrow',
        lastDay: 'Yesterday',
        month1: 'January',
        month2: 'February',
        month3: 'March',
        month4: 'April',
        month5: 'May',
        month6: 'June',
        month7: 'July',
        month8: 'August',
        month9: 'September',
        month10: 'October',
        month11: 'November',
        month12: 'December',
        weekDay1: 'Monday',
        weekDay2: 'Tuesday',
        weekDay3: 'Wednesday',
        weekDay4: 'Thursday',
        weekDay5: 'Friday',
        weekDay6: 'Saturday',
        weekDay7: 'Sunday',
    },
    tabs: {
        menu: 'Menu',
        cards: 'Accounts',
        welcome: 'Home',
        history: 'History',
        payments: 'Payments',
    },
    sections: {
        more: 'Everything',
        partitions: 'Sections',
        exchangeRates: 'Exchange rates',
    },
    menu: {
        extra: 'Advanced',
        partititons: 'All sections',
        aboutService: 'About service',
        profileSettings: 'Profile Settings',
        support: 'Support Service',
        faq: 'Help',
    },
    aboutService: {
        title: 'About the service',
    },
    faq: {
        title: 'Help',
        searchPlaceholder: 'Search',
    },
    qrScaner:{
        fetchingClientData: 'data is being processed...',
        clientNotFound: 'Error. Try scanning the QR code again',
    },
    login: {
        next: 'Next',
        title: 'Login',
        repeatSms: 'Send again',
        repeatSmsAfterTime: 'Send again in %{time} seconds.',
        confirmInfo: 'By clicking the \'Next\' button, you accept the conditions',
        userAgreement: 'User agreement',
        inputHeader: {
            title: 'By phone number',
            title1: 'Enter the code from SMS',
            title2: 'Enter the code from SMS or push notifications',
        },
    },
    welcome: {
        logIn: 'Log in',
        visibleExtraRate: 'More',
        invisibleExtraRate: 'Hide',
    },
    history: {
        segments: {
            all: 'All',
            in: 'Top-ups',
            out: 'Spend',
        },
    },
    cards: {
        balance: 'Balance',
        bonus: 'bonus',
        emptyTitle: 'Empty',
        addAccount: 'Open Account',
        logInButton: 'Log In',
        externalCards: 'Linked Cards',
        addExternalCard: 'Bind Map',
        emptyText: 'Accounts and privileges are available only to authorized users!',
    },
    payments: {
        title: 'Payments',
    },
    createAccount: {
        next: 'Next',
        title: 'Open Account',
        confirm: 'Confirm',
        selectCurrencyPlease: 'Select account currency',
    },
    support: {
        title: 'Support Service',
        inputPlaceholder: 'Message ...',
    },
    settings: {
        title: 'Settings',
        logOff: 'Logout',
        camera: 'Camera',
        cancel: 'Cancel',
        gallery: 'Gallery',
        theme: 'Design',
        emptyName: 'User',
        identifity: 'Identification',
        editProfile: 'Edit profile',
        goToIdentifity: 'Pass Certification',
        moveFromDarkTheme: 'Apply Light Theme',
        moveFromLightTheme: 'Apply Dark Theme',
        needGoToOfficeMessage: 'Leave the documents to eMoney\'s office!',
        clientYears: {
            one: '%{count} year',
            few: '%{count} years',
            zero: '%{count} years',
            other: '%{count} years',
            many: '%{count} years',
        },
    },
    accountInfo: {
        title: 'Account',
        append: 'Top up',
        details: 'Details',
        toAsk: 'Ask for money',
        payInShop: 'Spend bonuses at the store',
        transferBetween: 'Transfer between accounts',
        translateToMaster: 'Transfer bonuses to an account',
    },
    accountDetails: {
        title: 'Details',
        balance: 'Balance',
        recipient: 'Recipient',
        accountNumber: 'Number',
        accountCurrency: 'Currency',
        shareMessageTitle: 'Electronic account details of eMoney',
    },
    editProfile: {
        title: 'Profile',
        confirmPhone: 'Confirm phone number',
        form: {
            name: 'Name',
            city: 'City',
            gender: 'Gender',
            phone: 'Phone',
            language: 'Language',
            email: 'Email',
            dateOfBirth: 'Date of birth',
            saveChanges: 'Save Changes',
            genderType0: 'Not specified',
            genderType1: 'Man',
            genderType2: 'Woman',
            selectCity: 'Select city',
            confirmEmail: 'Confirm email',
            errorEmail: 'Enter a valid email',
            errorPhone: 'Enter the correct phone number',
            locales: {
                ru: 'Russian',
                en: 'English',
                kk: 'Kazakh',
            },
        },
    },
    serviceForm: {
        title: 'Pay',
        actions: {
            ok: 'Pay %{amount}',
            next: 'Next',
            transfer: {
                ok: 'Translate %{amount}',
            },
            NEXT: "Next"
        },
    },
    replenishForm: {
        title: 'Top up',
        price: 'Top-up amount',
        chooseToAccount: 'Select an account',
        cardNumber: 'Bank card number',
        actions: {
            ok: 'Top up by %{amount}',
            empty: 'Indicate the amount of recharge',
        },
    },
    localTransferForm: {
        title: 'Translation',
        priceSend: 'Write-off amount',
        priceGet: 'Amount received',
        chooseToAccount: 'Select an account',
        actions: {
            send: 'Translate %{amount}',
            get: 'Top up by %{amount}',
            empty: 'Enter the transfer amount',
        },
    },
    advertisingInfo: {
        moreInfo: 'Details',
        useIt: 'Use it',
    },
    passwordSet: {
        title: 'Set password',
        confirm: 'Confirm set',
    },
    contacts: {
        title: 'Contacts',
    },
    identification: {
        close: 'Close',
        confirm: 'Confirm',
        title: 'Identification',
        text: 'Enter the code from the SMS for the completion of the identification',
    },
    confirmation: {
        repeatAfterTime: 'You can request the password again in %{time} seconds.',
        title: 'Enter one-time password from SMS',
        sendNewCode: 'Send new password',
        repeat: 'Resubmit',
        amount: 'Amoiunt',
        account: 'Account',
        failTitle: 'Ups!',
        successTitle: 'Thank you!',
        failDetails: 'The operation\'s not done',
        successDetails: 'The operation has been successfully conducted',
    },
    errors: {
        invalidResponse: 'Error checking HTTP/S response data!',
        unknownResultCode: 'Error without description, code - %{code}',
    },
};