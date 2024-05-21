// @flow
import Color from 'color';
import React from 'react';
import {connect} from 'react-redux';
import {isValidNumber} from 'libphonenumber-js';
import {Navigation} from 'react-native-navigation';
import * as R from 'ramda';
import * as Animatable from 'react-native-animatable';
import {getNavigationComponent as getExternalPaymentNC} from '../../ExternalPayment';
import {ReduxUtils, type ReduxState} from '../../../reducers';
import {withTheme, type Theme, statusBarStyleGetter} from '../../../themes';
import {InteractionManager, ActivityIndicator, Image as RNImage, Animated, Alert, View, Linking} from 'react-native';
import LogIn from '../../LogIn';
import {
    getMessage,
    formatPhone,
    formatNumber,
    isValidEmail,
    reformatPhoneNumber,
    overlapScreenScrollValue,
} from '../../../utils';

import {LinkAgreement} from '../../../components/UIKit';

import {Image, NavBar, Button, Accessory, TextField, Containers, Typography, EmptyAccount} from '../../../components';

import {
    STATUS_BAR_HEIGHT,
    ServiceFieldKeyboardTypes,
    ServiceFieldTypes,
    ServiceTypes,
    emptyObject,
    emptyArray,
    type Account,
    type Service,
    type ServiceGroup,
    type ServiceField,
} from '../../../constants';

import currency from '../../../currency';
import doing from '../../../doing';
import i18n from '../../../i18n';

import Confirmation from '../../Confirmation';
import Contacts from '../../Contacts';

import getStyles from './styles';
import ServiceLogo from '../../../resources/svg/logo.svg';
import ChooseAccount from '../../ChooseAccount';

export type Props = {
    isParentTabs?: boolean,
    hasAuthClient: boolean,
    group: ServiceGroup,
    hasNetwork: boolean,
    accounts: Account[],
    account?: Account,
    isModal?: boolean,
    service: Service,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    error: any,
    filled: boolean,
    loading: boolean,
    account: ?Account,
    hasPrice: boolean,
    fields: ServiceField[],
    errors: {[code: string]: any},
    actionButtonCode: string | 'ok',
    results: {[code: string]: string},
    linkAgreementChecked: ?boolean,
};

export function reformatFieldResultValue(filed: ServiceField, value: string): string {
    if (filed.type === ServiceFieldTypes.textbox) {
        switch (filed.keyboard) {
            case ServiceFieldKeyboardTypes.phone:
            case ServiceFieldKeyboardTypes.cardNumber:
                return value.replace(/(\W+)/gi, '');
            default:
                break;
        }
    }
    return value;
}

class ServiceFormScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (!state.account) {
            if (props.account || props.accounts.length > 0) {
                return {
                    account: state.account || props.account || (props.accounts.length > 0 ? props.accounts[0] : null),
                };
            }
        }
        return null;
    }
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    mounted: boolean = false;
    state: State = {
        fields: [],
        errors: {},
        error: null,
        results: {},
        filled: false,
        account: null,
        loading: true,
        hasPrice: false,
        actionButtonCode: 'ok',
        linkAgreementChecked: true,
    };

    componentDidMount() {
        this.mounted = true;
        InteractionManager.runAfterInteractions(() => {
            if (!this.props.service) {
                return;
            }
            doing.api.services
                .getServiceFormRequest(this.props.service.id)
                .success((fields: ServiceField[]) => {
                    console.log('FIELDS', fields);
                    const info = this.buildFieldsInfo(fields);
                    this.mounted &&
                        this.setState({
                            fields,
                            loading: false,
                            ...info,
                            ...this.validateResults(info.results, fields),
                        });
                })
                .error((error: any) => {
                    this.mounted && this.setState({error, loading: false});
                    Alert.alert('Ошибка!', getMessage(error));
                })
                .start();
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: this.scrollY,
                    },
                },
            },
        ],
        {useNativeDriver: true},
    );

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onPressAction = () => {
        const {account, filled} = this.state;
        if (!filled || !account || !this.props.service) {
            return;
        }
        const results = (this.state.fields || []).reduce((list: any[], field: ServiceField) => {
            if (field.code in this.state.results) {
                list.push({
                    code: field.code,
                    value: reformatFieldResultValue(field, this.state.results[field.code] || ''),
                });
            }
            return list;
        }, []);
        this.mounted &&
            this.setState({loading: true}, () => {
                doing.api.services
                    .filledServiceFormRequest(this.props.service.id, this.props.service.code, account.number, results)
                    .success((data: any) => {
                        console.log('FORM PAY', data);

                        const bankURL = R.pathOr('', ['bankUrl'], data);

                        // pay from bank
                        if ((bankURL || '').length > 4) {
                            return Navigation.showModal(
                                getExternalPaymentNC({
                                    bankURL,
                                    onCancel: () => {
                                        const operationId = R.pathOr(0, ['operationId'], data);
                                        console.log('AFTER - CLOSE', operationId);
                                        doing.api.services
                                            .cancelOperationRequest(operationId)
                                            .after(() => {
                                                console.log('AFTER');
                                                this.setState({loading: false});
                                            })
                                            .start();
                                    },
                                    onSuccess: () => {
                                        return Confirmation.show(
                                            {
                                                ...data,
                                                account,
                                            },
                                            {
                                                withOutEnterCode: data.result !== 3,
                                                onClose: () => this.onPressClose(),
                                            },
                                        );
                                    },
                                }),
                            );
                        } else if ((data.fields || []).length > 0) {
                            const info = this.buildFieldsInfo(data.fields);
                            return (
                                this.mounted &&
                                this.setState({
                                    fields: data.fields,
                                    loading: false,
                                    ...info,
                                    ...this.validateResults(info.results, data.fields),
                                })
                            );
                        } else {
                            return Confirmation.show(
                                {
                                    ...data,
                                    account,
                                },
                                {
                                    withOutEnterCode: data.result !== 3,
                                    onClose: () => this.onPressClose(),
                                },
                            );
                        }
                    })
                    .error((error: any) => {
                        this.mounted && this.setState({error, loading: false});
                        Alert.alert('Ошибка!', getMessage(error));
                    })
                    .start();
            });
    };

    onChooseAccount = (account: Account) => this.mounted && this.setState({account});

    onPressChooseAccount = () =>
        ChooseAccount.show({
            account: this.state.account,
            onChoose: this.onChooseAccount,
        });

    onChangeValue = (code: string, keyboard: number, isRequired: boolean, value: string) => {
        const nextValue = ServiceFieldKeyboardTypes.hasInputTrimm(keyboard) ? value.trim() : value;
        const results = {
            ...this.state.results,
            [code]: nextValue,
        };
        this.mounted &&
            this.setState({
                ...(isRequired || nextValue.length > 0 ? this.validateResults(results) : {}),
                results,
            });
    };

    onPressAgreement = () => {
        this.setState((prevState) => ({
            linkAgreementChecked: !prevState.linkAgreementChecked,
        }));
    };

    onPressLinkAgreement = () => {
        if (!this.props.contractOffer) {
            return;
        }
        const url = this.props.contractOffer || '';
        Linking.canOpenURL(url)
            .then(() => Linking.openURL(url))
            .catch((error: any) => Alert.alert('Ошибка!', getMessage(error)));
    };

    onPressLogIn = () => LogIn.show();

    keyExtractor = (item) => `f.${item.code || item.caption}`;

    validateResults = (results: any, fields?: ServiceField[]): any => {
        if (!results) {
            return {filled: false, errors: {}};
        }
        const count = this.state.fields.length;
        return (fields || this.state.fields).reduce(
            (m: any, field: ServiceField) => {
                const v = results[field.code];
                switch (field.type) {
                    case ServiceFieldTypes.textbox:
                        switch (field.keyboard) {
                            case ServiceFieldKeyboardTypes.email:
                                const _ie = isValidEmail(v || '');
                                if (!field.isRequired || _ie) {
                                    m.__fc += 1;
                                }
                                if (!_ie && v && v.length > 0) {
                                    m.errors[field.code] = i18n.t('editProfile.form.errorEmail');
                                }
                                break;
                            case ServiceFieldKeyboardTypes.phone:
                                const _i = isValidNumber(`+${reformatPhoneNumber(v || '')}`);
                                if (!field.isRequired || _i) {
                                    m.__fc += 1;
                                }
                                if (!_i && v && v.length > 1) {
                                    m.errors[field.code] = i18n.t('editProfile.form.errorPhone');
                                }
                                break;
                            default:
                                if (field.keyboard === ServiceFieldKeyboardTypes.number && field.code === 'Price') {
                                    if ((parseFloat(v || '0') || 0) <= 0) {
                                        break;
                                    }
                                }
                                if (!field.isRequired || (v && v.length > 0)) {
                                    m.__fc += 1;
                                }
                                break;
                        }
                        break;
                    default:
                        m.__fc += 1;
                        break;
                }
                m.filled = m.__fc >= count && count > 0;
                return m;
            },
            {filled: false, __fc: 0, errors: {}},
        );
    };

    buildFieldsInfo = (fields: ServiceField[]): any =>
        fields.reduce(
            (m: any, field: ServiceField) => {
                if (field.code.toLowerCase() === 'price') {
                    m.hasPrice = true;
                }
                if (field.code && ServiceFieldTypes.hasValue(field.type)) {
                    m.results[field.code] = field.value || '';
                    if (field.keyboard === ServiceFieldKeyboardTypes.phone && (field.value || '').length > 0) {
                        m.results[field.code] = formatPhone(reformatPhoneNumber(`+${field.value}`));
                    }
                }
                if (field.type === ServiceFieldTypes.button) {
                    m.actionButtonCode = field.code || 'ok';
                }
                return m;
            },
            {results: {}, errors: {}, hasPrice: false, actionButtonCode: 'ok', filled: false},
        );

    getFieldFormatter = (keyboard: number) => {
        switch (keyboard) {
            case ServiceFieldKeyboardTypes.number:
                return formatNumber;
            case ServiceFieldKeyboardTypes.phone:
                return formatPhone;
            default:
                break;
        }
        return undefined;
    };

    getFieldInputProps = (keyboard: number) => {
        switch (keyboard) {
            case ServiceFieldKeyboardTypes.number:
                return {
                    autoCorrect: false,
                    autoCapitalize: 'none',
                    autoCompleteType: 'off',
                    keyboardType: 'decimal-pad',
                };
            case ServiceFieldKeyboardTypes.email:
                return {
                    autoCorrect: false,
                    autoCapitalize: 'none',
                    autoCompleteType: 'email',
                    keyboardType: 'email-address',
                    textContentType: 'emailAddress',
                };
            case ServiceFieldKeyboardTypes.phone:
                return {
                    autoCorrect: false,
                    autoCapitalize: 'none',
                    autoCompleteType: 'off',
                    keyboardType: 'phone-pad',
                    textContentType: 'telephoneNumber',
                };
            default:
                break;
        }
        return emptyObject;
    };

    getFieldRightAccessoryRenderer = (item: ServiceField) => {
        switch (item.keyboard) {
            case ServiceFieldKeyboardTypes.phone:
                return () => (
                    <Button
                        variant="icon"
                        alignContent="center"
                        onPress={() =>
                            Contacts.show({
                                onSelect: ({phoneNumber}: any) =>
                                    this.onChangeValue(
                                        item.code,
                                        item.keyboard,
                                        item.isRequired,
                                        formatPhone(reformatPhoneNumber(phoneNumber)),
                                    ),
                            })
                        }
                        style={this.props.styles.fieldAccessory}
                        hitSlop={{left: 4, right: 4, top: 4, bottom: 4}}>
                        <RNImage
                            resizeMode="contain"
                            style={this.props.styles.fieldAccessoryIcon}
                            source={require('../../../resources/icons/ic-contact.png')}
                        />
                    </Button>
                );
            default:
                return null;
        }
    };

    //-----------------------------------------------------
    // комиссия
    //-----------------------------------------------------
    getCommissionText = (item) => {
        const {account} = this.state;
        const {service} = this.props;

        console.log('ITEm', item);

        // save
        let description = item.description;

        if (R.pathOr(false, ['service'], this.props)) {
            console.log('SERVICE', service);

            const haveComission = service.commission > 0;
            const haveBonuses = service.bonusPercent > 0;
            const thisIsPriceField = R.propEq('code', 'Price', item);

            if (thisIsPriceField) {
                if (haveComission) {
                    // calculate comission value
                    const defaultTo0 = R.defaultTo(0);
                    let comissionValue = defaultTo0(
                        (parseFloat(this.state.results[item.code]) * parseFloat(service.commission)) / 100,
                    );

                    description = 'Комиссия: ' + comissionValue + ' ' + currency.symbol(account.currency);

                    // have min max
                    const haveComissionMinMaxValues = R.pathOr(false, ['commissionMax'], service);

                    console.log('HAVE COMIS', haveComissionMinMaxValues);

                    if (haveComissionMinMaxValues) {
                        comissionValue = Math.max(
                            service.commissionMin,
                            Math.min(service.commissionMax || 0, comissionValue),
                        );

                        description =
                            'Комиссия: ' +
                            comissionValue +
                            ' ' +
                            currency.symbol(account.currency) +
                            ' мин. ' +
                            service.commissionMin +
                            ' макс. ' +
                            service.commissionMax;
                    }
                } else {
                    description = 'Без комиссии';
                }
            }

            if (haveBonuses) {
                // calculate comission value
                const defaultTo0 = R.defaultTo(0);
                let bonusesValue = defaultTo0(
                    (parseFloat(this.state.results[item.code]) * parseFloat(service.bonusPercent)) / 100,
                );
                description += '\n' + 'Будет начислено бонусов: ' + Math.round(bonusesValue);
            }
        }

        return description;
    };

    renderItem = ({item}: any) => {
        switch (item.type) {
            case ServiceFieldTypes.textbox:
                return (
                    <TextField
                        label={item.caption}
                        title={this.getCommissionText(item)}
                        editable={!item.isReadOnly}
                        disabled={this.state.loading}
                        value={this.state.results[item.code]}
                        formatText={this.getFieldFormatter(item.keyboard)}
                        inputProps={this.getFieldInputProps(item.keyboard)}
                        renderRightAccessory={this.getFieldRightAccessoryRenderer(item)}
                        onChangeText={(text: string) =>
                            this.onChangeValue(item.code, item.keyboard, item.isRequired || false, text)
                        }
                        error={item.code in this.state.errors ? getMessage(this.state.errors[item.code]) : undefined}
                    />
                );
            case ServiceFieldTypes.label:
                return (
                    <View style={this.props.styles.labelField}>
                        <Typography
                            variant="subheading"
                            fontWeight={(item.description || '').length > 0 ? 'bold' : 'normal'}>
                            {item.caption}
                        </Typography>
                        {(item.description || '').length > 0 ? (
                            <Typography variant="body1">{item.description}</Typography>
                        ) : null}
                    </View>
                );
            case ServiceFieldTypes.separator:
                return <View style={this.props.styles.separator} />;
            default:
                return null;
        }
    };

    renderActionBlock = () => {
        if (!this.props.group || !this.props.service) {
            return null;
        }
        const {account, results, loading, hasPrice, linkAgreementChecked} = this.state;
        const {themeName} = this.props;
        if (!account || !hasPrice) {
            if (loading) {
                return (
                    <View style={this.props.styles.loader}>
                        <ActivityIndicator size="small" color={this.props.theme.colors.button} animating />
                    </View>
                );
            }
            return null;
        }
        const isNext = this.state.actionButtonCode === 'next';
        const price = parseFloat((results || {}).Price || 0) || 0;
        const amount = price > 0 ? currency(price, account.currency).format(true) : '';


        console.log("<<<<<<<<<<<<<<<<1 >>>>>>>>>>>>>>>>>>>>")
        console.log(`serviceForm.actions.${ServiceTypes.name(this.props.service.type)}.${
            this.state.actionButtonCode
            }`);
        console.log("<<<<<<<<<<<<<<<< 22 >>>>>>>>>>>>>>>>>>>>")
        console.log(`serviceForm.actions.${this.state.actionButtonCode}`);
        console.log("<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>")
        console.log("<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>")
        console.log("<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>")
        console.log(this.state.actionButtonCode);


        return (
            <Animatable.View style={this.props.styles.actionBlock} duration={400} useNativeDriver animation="fadeIn">
                <LinkAgreement
                    containerStyle={{marginBottom: 8, paddingRight: 12}}
                    checked={linkAgreementChecked}
                    title={'Я соглашаюсь с условиями'}
                    titleStyle={themeName === 'light' ? {color: '#1a1a1a'} : {color: '#fff'}}
                    linkText={'Публичной оферты'}
                    onPress={() => this.onPressAgreement()}
                    onLinkPress={() => this.onPressLinkAgreement()}
                />
                <Button
                    variant="contained"
                    loading={this.state.loading}
                    onPress={this.onPressAction}
                    disabled={!this.state.filled || !linkAgreementChecked}
                    alignContent={isNext ? 'space-between' : 'center'}
                    accessory={isNext ? <Accessory variant="button" size={10} /> : undefined}>
                    {i18n.t(
                        `serviceForm.actions.${ServiceTypes.name(this.props.service.type)}.${
                            this.state.actionButtonCode
                        }`,
                        {
                            defaultValue: i18n.t(`serviceForm.actions.${this.state.actionButtonCode}`, {amount}),
                            amount,
                        },
                    )}
                </Button>
            </Animatable.View>
        );
    };

    //-------------------------------------------------
    // render auth screen
    //-------------------------------------------------
    renderAuthScreen = () => {
        return <EmptyAccount onPressLogIn={this.onPressLogIn} />;
    };

    //-------------------------------------------------
    // render serive screen
    //-------------------------------------------------
    renderServiceScreen = () => {
        const {styles, theme, service, accounts, group} = this.props;
        const headerColor: string = (group || {}).colorCart || theme.colors.button;
        const headerTintColor: string = Color(headerColor).darken(0.125).isDark() ? '#fff' : '#252525';
        return (
            <View style={styles.navBarInfo}>
                {this.state.hasPrice ? (
                    <Animatable.View useNativeDriver duration={600} animation="fadeIn">
                        <Button
                            variant="contained"
                            tintColor={headerTintColor}
                            style={styles.accountButton}
                            onPress={accounts.length > 1 ? this.onPressChooseAccount : undefined}
                            accessory={accounts.length > 1 ? <Accessory variant="button" size={12} /> : undefined}>
                            <View style={{flex: 1, paddingTop: 4}}>
                                <View style={styles.accountNumberBlock}>
                                    <ServiceLogo width={10} height={10} style={{marginRight: 8}} />
                                    <Typography
                                        fontSize={12}
                                        variant="body1"
                                        numberOfLines={1}
                                        color={styles.headerTintColor}>
                                        {this.state.account ? this.state.account.number : ''}
                                    </Typography>
                                </View>
                                <Typography
                                    fontSize={28}
                                    fontWeight="400"
                                    numberOfLines={1}
                                    variant="display1"
                                    color={styles.headerTintColor}>
                                    {this.state.account
                                        ? currency(this.state.account.balance, this.state.account.currency).format(true)
                                        : ''}
                                </Typography>
                            </View>
                        </Button>
                    </Animatable.View>
                ) : null}
                <View
                    style={[styles.serviceInfoBlock, group.colorCart ? {backgroundColor: group.colorCart} : undefined]}>
                    <Typography style={{flex: 1}} numberOfLines={2} variant="subheading" color={headerTintColor}>
                        {service ? service.name : ''}
                    </Typography>
                    {service && service.picture ? (
                        <Image
                            resizeMode="contain"
                            svgContentScale={0.65}
                            style={styles.serviceIcon}
                            loaderColor={headerTintColor}
                            svgProps={{
                                fill: headerTintColor,
                                override: {
                                    fill: headerTintColor,
                                },
                            }}
                            source={doing.api.files.sourceBy(service)}
                            defaultSource={doing.api.files.sourceBy(group)}
                        />
                    ) : null}
                </View>
            </View>
        );
    };

    render() {
        const {styles, theme, group, isModal, hasAuthClient} = this.props;
        const headerColor: string = (group || {}).colorCart || theme.colors.button;

        console.log('GROUP', this.props);

        if (!hasAuthClient) {
            return (
                <View style={{flex: 1}}>
                    {this.renderAuthScreen()}
                    <NavBar
                        useHardwareBackHandler
                        style={styles.fixedNavBar}
                        onPressBack={this.onPressClose}
                        title={i18n.t('serviceForm.title')}
                        showBackButton={isModal ? 'close' : true}
                        scrollY={overlapScreenScrollValue(this.scrollY)}
                        translucentStatusBar={isModal ? 'adaptive' : true}
                    />
                </View>
            );
        }

        return (
            <View testID="service-form" style={styles.container}>
                {hasAuthClient && (
                    <Containers.KeyboardAvoiding style={{flex: 1}}>
                        <Animated.FlatList
                            style={styles.list}
                            removeClippedSubviews
                            directionalLockEnabled
                            data={this.state.fields}
                            onScroll={this.onScroll}
                            renderItem={this.renderItem}
                            refreshing={this.state.loading}
                            keyExtractor={this.keyExtractor}
                            keyboardShouldPersistTaps="handled"
                            automaticallyAdjustContentInsets={false}
                            ListFooterComponent={this.renderActionBlock}
                            contentInsetAdjustmentBehavior="never"
                            contentContainerStyle={styles.listContentContainer(this.state.hasPrice)}
                        />
                    </Containers.KeyboardAvoiding>
                )}
                <NavBar
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    onPressBack={this.onPressClose}
                    title={i18n.t('serviceForm.title')}
                    showBackButton={isModal ? 'close' : true}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}>
                    {hasAuthClient && this.renderServiceScreen()}
                </NavBar>
            </View>
        );
    }
}

export const navigationName = 'app.ServiceForm';
export function getNC(service: Service, group: ServiceGroup, passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: {
                ...(passProps || {}),
                skipThemingStatusBar: true,
                service,
                group,
            },
            options: {
                topBar: {
                    visible: false,
                },
                statusBar: {
                    visible: true,
                    drawBehind: true,
                    backgroundColor: 'transparent',
                    style: statusBarStyleGetter(doing.theme.currentTheme()),
                },
                ...(options || {}),
            },
        },
    };
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    accounts: (state.client.info || {}).accounts || emptyArray,
    hasAuthClient: ReduxUtils.hasAuthClient(state),
    hasNetwork: state.indicators.net === 'online',
    contractOffer: (state.auth.info || {}).contractOffer,
    themeName: state.theme.name,
}))(withTheme(ServiceFormScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
