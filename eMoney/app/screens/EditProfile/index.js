// @flow
import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
import {connect} from 'react-redux';
import {isValidNumber} from 'libphonenumber-js';
import {Navigation} from 'react-native-navigation';
import Collapsible from 'react-native-collapsible';
import {ReduxUtils, type ReduxState} from '../../reducers';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {API_CLIENT_EDIT, STATUS_BAR_HEIGHT, emptyObject, type ClientInfo} from '../../constants';
import {Animated, Alert, View, ActivityIndicator, Keyboard, Image, Dimensions} from 'react-native';
import {reformatPhoneNumber, isValidEmail, getMessage, formatPhone, overlapScreenScrollValue} from '../../utils';
import {
    CollapsibleIndicator,
    CarouselDatePicker,
    Containers,
    Typography,
    TextField,
    Button,
    NavBar,
} from '../../components';

import LogIn from '../LogIn';

import Request from '../../doing/request';
import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type Props = ClientInfo & {
    componentId: any,
    fetching: boolean,
    isModal?: boolean,
    theme: Theme,
    styles: any,
};

type DateOfBirth = {
    day: number,
    month: number,
    year: ?number,
};

type State = {
    name: string,
    city: string,
    phone: string,
    email: string,
    cities: any[],
    gender: number,
    ready: boolean,
    country: string,
    changed: boolean,
    language: string,
    cityQuery: string,
    openGroupId: number,
    isValidPhone: boolean,
    isValidEmail: boolean,
    citySearching: boolean,
    dateOfBirth: ?DateOfBirth,
    changedPhoneNumber: boolean,
    sendingRepeatEmail: boolean,
};

class EditProfileScreen extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): any {
        if (!state.ready && (props.clientGuid || '').length > 4) {
            return {
                cities: [],
                ready: true,
                changed: false,
                name: props.name || '',
                city: props.city || '',
                email: props.email || '',
                gender: props.gender || 0,
                changedPhoneNumber: false,
                cityQuery: props.city || '',
                country: props.country || '',
                language: props.language || 'ru',
                phone: formatPhone(`+${props.phone}`),
                isValidPhone: isValidNumber(`+${props.phone}`),
                isValidEmail: isValidEmail(props.email || '', true),
                dateOfBirth: props.dateOfBirth ? CarouselDatePicker.dateObjectFromNumber(props.dateOfBirth) : null,
            };
        }
        const changedPhoneNumber = `${props.phone}` !== reformatPhoneNumber(state.phone);
        const changed =
            changedPhoneNumber ||
            state.name !== props.name ||
            state.city !== props.city ||
            state.email !== props.email ||
            state.gender !== props.gender ||
            state.language !== props.language ||
            (props.dateOfBirth || 0) !== CarouselDatePicker.dateObjectToNumber(state.dateOfBirth);

        if (changed !== state.changed || changedPhoneNumber !== state.changedPhoneNumber) {
            return {changed, changedPhoneNumber};
        }
        return null;
    }
    scrollY: Animated.Value = new Animated.Value(-STATUS_BAR_HEIGHT);
    searchCityRequest: ?Request = null;
    mounted: boolean = false;
    state: State = {
        sendingRepeatEmail: false,
        changedPhoneNumber: false,
        isValidPhone: false,
        isValidEmail: false,
        dateOfBirth: null,
        openGroupId: -1,
        language: 'ru',
        changed: false,
        ready: false,
        country: '',
        gender: 0,
        phone: '',
        email: '',
        name: '',
        city: '',
        cities: [],
        cityQuery: '',
        citySearching: false,
    };

    componentDidMount() {
        this.mounted = true;
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

    onPressClose = (options: any = {}) => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        if (options && options.resetNavigation) {
            return Navigation.popToRoot(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onChangeName = (name: string) => this.mounted && this.setState({name});

    onChangeEmail = (text: string) =>
        this.mounted &&
        this.setState({
            email: text.trim(),
            isValidEmail: isValidEmail(text.trim(), true),
        });

    onChangePhone = (text: string) =>
        this.mounted &&
        this.setState({
            phone: text.trim(),
            isValidPhone: isValidNumber(`+${reformatPhoneNumber(text)}`),
        });

    onPressGroup = (id: number) =>
        this.mounted &&
        this.setState((state: State) => ({openGroupId: state.openGroupId === id ? -1 : id}), Keyboard.dismiss);

    onPressDateOfBirthGroup = () =>
        this.mounted &&
        this.setState(
            (state: State) => ({
                openGroupId: state.openGroupId === 1 ? -1 : 1,
                dateOfBirth: state.dateOfBirth
                    ? state.dateOfBirth
                    : {
                          day: Moment().date(),
                          month: Moment().month() + 1,
                          year: null,
                      },
            }),
            Keyboard.dismiss,
        );

    onChangeGenderType = (gender: 0 | 1 | 2) =>
        this.mounted && this.setState({gender: gender === (this.state.gender || 0) ? 0 : gender});

    onChangeDateOfBirth = (dateOfBirth: DateOfBirth) => this.mounted && this.setState({dateOfBirth});

    onChangeCity = (city: any) =>
        this.mounted &&
        this.setState({
            city: city.name,
            country: city.country,
            cityQuery: city.name,
        });

    onChangeLanguage = (locale: string) =>
        this.mounted &&
        this.setState({
            language: locale,
        });

    onChangeCityQuery = (text: string) => {
        this.searchCityRequest && this.searchCityRequest.cancel();
        const citySearching = text.trim() !== this.state.city && text.trim().length > 0;
        this.mounted &&
            this.setState(
                {cityQuery: text.trim(), citySearching},
                citySearching
                    ? () => {
                          if (this.state.cityQuery.length < 1) {
                              return;
                          }
                          this.searchCityRequest = doing.algolia
                              .searchCityInfoRequest(this.state.cityQuery, i18n.currentLocale())
                              .withDelay(600)
                              .success((data: any) => {
                                  this.searchCityRequest = null;
                                  const m = ((data || {}).hits || []).reduce((m: any, {localeNames, country}: any) => {
                                      (localeNames || []).forEach((localeName: string) => {
                                          m[localeName] = country;
                                      });
                                      return m;
                                  }, {});
                                  this.mounted &&
                                      this.setState({
                                          cities: _.keys(m).map((key: string) => ({
                                              country: m[key],
                                              name: key,
                                          })),
                                      });
                              })
                              .after(() => {
                                  this.mounted && this.setState({citySearching: false});
                              });
                          this.searchCityRequest.start();
                      }
                    : undefined,
            );
    };

    onPressRepeatEmail = () =>
        this.mounted &&
        this.setState({sendingRepeatEmail: true}, () =>
            doing.api.client
                .repeatEmailConfirmRequest()
                .error((err: any) => Alert.alert('Ошибка!', getMessage(err)))
                .success(() => Alert.alert('Подтвержение email', 'Код успешно выслан на вашу почту!'))
                .after(() => this.mounted && this.setState({sendingRepeatEmail: false}))
                .start(),
        );

    onPressSave = () => {
        const phoneNumber = parseInt(reformatPhoneNumber(this.state.phone), 10);
        doing.api.client
            .editRequest(
                {
                    phoneNumber,
                    city: this.state.city,
                    country: this.state.country,
                    name: this.state.name.trim(),
                    gender: this.state.gender || 0,
                    language: this.state.language || 'ru',
                    clientGuid: this.props.clientGuid || '',
                    email: (this.state.email || '').length > 0 ? this.state.email : null,
                    dateOfBirth: CarouselDatePicker.dateObjectToNumber(this.state.dateOfBirth) || null,
                },
                !this.state.changedPhoneNumber,
            )
            .error((error: any) => Alert.alert('Ошибка!', getMessage(error)))
            .success(() => {
                if (this.state.changedPhoneNumber && phoneNumber > 0) {
                    return LogIn.show({
                        lockClose: true,
                        onClose: this.onPressClose,
                        initPhoneNumber: phoneNumber,
                        request: doing.api.client.infoRequest(),
                        title: i18n.t('editProfile.confirmPhone'),
                    });
                }
                // noinspection JSIgnoredPromiseFromCall
                this.onPressClose();
            })
            .start();
    };

    renderDateOfBirth = (date: ?DateOfBirth): string => {
        if (!date) {
            return 'Не указана';
        }
        // noinspection SpellCheckingInspection
        return Moment([date.year || CarouselDatePicker.emptyYear, date.month - 1, date.day]).format(
            (date.year || 0) > 0 && date.year !== CarouselDatePicker.emptyYear ? 'D MMMM YYYY' : 'D MMMM',
        );
    };

    render() {
        const {styles, theme, fetching, email, confirmedEmail, isModal} = this.props;
        const {width} = Dimensions.get('window');
        const withChooseFromCities =
            this.state.city !== this.state.cityQuery && this.state.cityQuery.length > 0 && this.state.cities.length > 0;
        return (
            <View testID="edit-profile" style={styles.container}>
                <Containers.KeyboardAvoiding style={{flex: 1}}>
                    <Animated.ScrollView
                        style={styles.list}
                        removeClippedSubviews
                        directionalLockEnabled
                        onScroll={this.onScroll}
                        keyboardShouldPersistTaps="always"
                        contentInsetAdjustmentBehavior="never"
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.listContentContainer}>
                        <TextField
                            value={this.state.name}
                            onChangeText={this.onChangeName}
                            label={i18n.t('editProfile.form.name')}
                        />
                        <View style={styles.field}>
                            <Typography variant="body1" color="secondary" fontSize={12}>
                                {i18n.t('editProfile.form.gender')}
                            </Typography>
                            <Button
                                variant="action"
                                style={styles.fieldContent}
                                onPress={() => this.onPressGroup(2)}
                                accessory={() => <CollapsibleIndicator open={this.state.openGroupId === 2} />}>
                                {i18n.t(`editProfile.form.genderType${this.state.gender}`)}
                            </Button>
                        </View>
                        {this.state.ready ? (
                            <Collapsible collapsed={this.state.openGroupId !== 2}>
                                {this.state.openGroupId === 2 ? (
                                    <View style={styles.genderListWrapper}>
                                        <Button
                                            onPress={() => this.onChangeGenderType(1)}
                                            variant={this.state.gender === 1 ? 'contained' : 'outlined'}>
                                            {i18n.t('editProfile.form.genderType1')}
                                        </Button>
                                        <View style={{width: 5}} />
                                        <Button
                                            onPress={() => this.onChangeGenderType(2)}
                                            variant={this.state.gender === 2 ? 'contained' : 'outlined'}>
                                            {i18n.t('editProfile.form.genderType2')}
                                        </Button>
                                    </View>
                                ) : null}
                            </Collapsible>
                        ) : null}
                        <View style={styles.field}>
                            <Typography variant="body1" color="secondary" fontSize={12}>
                                {i18n.t('editProfile.form.dateOfBirth')}
                            </Typography>
                            <Button
                                variant="action"
                                style={styles.fieldContent}
                                onPress={this.onPressDateOfBirthGroup}
                                accessory={() => <CollapsibleIndicator open={this.state.openGroupId === 1} />}>
                                {this.renderDateOfBirth(this.state.dateOfBirth)}
                            </Button>
                        </View>
                        {this.state.ready ? (
                            <Collapsible collapsed={this.state.openGroupId !== 1}>
                                {this.state.openGroupId === 1 ? (
                                    <CarouselDatePicker
                                        width={width - 40}
                                        date={this.state.dateOfBirth}
                                        style={styles.datePickerBlock}
                                        onChangeDate={this.onChangeDateOfBirth}
                                        showAnimation={this.state.openGroupId === 1 ? 'fadeIn' : undefined}
                                    />
                                ) : null}
                            </Collapsible>
                        ) : null}
                        <TextField
                            inputProps={{
                                autoCorrect: false,
                                autoCapitalize: 'none',
                                autoCompleteType: 'off',
                                keyboardType: 'phone-pad',
                                textContentType: 'telephoneNumber',
                            }}
                            error={!this.state.isValidPhone ? i18n.t('editProfile.form.errorPhone') : undefined}
                            label={i18n.t('editProfile.form.phone')}
                            onChangeText={this.onChangePhone}
                            formatText={formatPhone}
                            value={this.state.phone}
                        />
                        <TextField
                            inputProps={{
                                autoCorrect: false,
                                autoCapitalize: 'none',
                                autoCompleteType: 'email',
                                keyboardType: 'email-address',
                                textContentType: 'emailAddress',
                            }}
                            error={
                                !this.state.isValidEmail
                                    ? i18n.t('editProfile.form.errorEmail')
                                    : (email || '').length > 0 && !confirmedEmail
                                    ? i18n.t('editProfile.form.confirmEmail')
                                    : undefined
                            }
                            label={i18n.t('editProfile.form.email')}
                            renderRightAccessory={
                                !confirmedEmail && (email || '').length >= 5
                                    ? () =>
                                          this.state.sendingRepeatEmail ? (
                                              <ActivityIndicator
                                                  color={theme.colors.errorText}
                                                  size="small"
                                                  animating
                                              />
                                          ) : (
                                              <Button
                                                  variant="icon"
                                                  alignContent="center"
                                                  style={styles.repeatEmail}
                                                  onPress={this.onPressRepeatEmail}
                                                  hitSlop={{left: 8, right: 8, top: 8, bottom: 8}}>
                                                  <Image
                                                      resizeMode="contain"
                                                      style={styles.repeatEmailIcon}
                                                      source={require('../../resources/icons/ic-repeat.png')}
                                                  />
                                              </Button>
                                          )
                                    : undefined
                            }
                            onChangeText={this.onChangeEmail}
                            value={this.state.email}
                        />
                        <View style={styles.field}>
                            <Typography variant="body1" color="secondary" fontSize={12}>
                                {i18n.t('editProfile.form.language')}
                            </Typography>
                            <Button
                                variant="action"
                                style={styles.fieldContent}
                                onPress={() => this.onPressGroup(3)}
                                accessory={() => <CollapsibleIndicator open={this.state.openGroupId === 3} />}>
                                {i18n.t(`editProfile.form.locales.${this.state.language}`)}
                            </Button>
                        </View>
                        {this.state.ready ? (
                            <Collapsible collapsed={this.state.openGroupId !== 3}>
                                {this.state.openGroupId === 3 ? (
                                    <View style={styles.languagesBlock}>
                                        <Button
                                            style={{marginRight: 5, marginBottom: 5}}
                                            onPress={() => this.onChangeLanguage('ru')}
                                            variant={this.state.language === 'ru' ? 'contained' : 'outlined'}>
                                            {i18n.t('editProfile.form.locales.ru')}
                                        </Button>
                                        <Button
                                            style={{marginRight: 5, marginBottom: 5}}
                                            onPress={() => this.onChangeLanguage('kk')}
                                            variant={this.state.language === 'kk' ? 'contained' : 'outlined'}>
                                            {i18n.t('editProfile.form.locales.kk')}
                                        </Button>
                                        <Button
                                            style={{marginRight: 5, marginBottom: 5}}
                                            onPress={() => this.onChangeLanguage('en')}
                                            variant={this.state.language === 'en' ? 'contained' : 'outlined'}>
                                            {i18n.t('editProfile.form.locales.en')}
                                        </Button>
                                    </View>
                                ) : null}
                            </Collapsible>
                        ) : null}
                        <TextField
                            inputProps={{
                                autoCorrect: false,
                                autoCapitalize: 'none',
                                textContentType: 'addressCity',
                            }}
                            renderRightAccessory={() =>
                                this.state.citySearching ? (
                                    <ActivityIndicator color={theme.colors.button} size="small" animating />
                                ) : null
                            }
                            error={withChooseFromCities ? i18n.t('editProfile.form.selectCity') : undefined}
                            label={i18n.t('editProfile.form.city')}
                            onChangeText={this.onChangeCityQuery}
                            value={this.state.cityQuery || ''}
                            title={this.state.country}
                        />
                        {withChooseFromCities ? (
                            <View style={styles.citiesBlock}>
                                {this.state.cities.map((city: any, index: number) => (
                                    <View key={`c.${index}.${city.name}`} style={{marginRight: 5, marginTop: 5}}>
                                        <Button
                                            onPress={() => this.onChangeCity(city)}
                                            variant={this.state.gender === 1 ? 'contained' : 'outlined'}>
                                            <View>
                                                <Typography variant="body1" color="button-caption">
                                                    {city.name}
                                                </Typography>
                                                <Typography variant="body1" fontSize={10} color="button-caption">
                                                    {city.country}
                                                </Typography>
                                            </View>
                                        </Button>
                                    </View>
                                ))}
                            </View>
                        ) : null}
                        <View style={styles.actionBlock}>
                            <Button
                                loading={fetching}
                                variant="contained"
                                alignContent="center"
                                disabled={
                                    withChooseFromCities ||
                                    !this.state.isValidEmail ||
                                    !this.state.isValidEmail ||
                                    !this.state.changed
                                }
                                onPress={this.onPressSave}>
                                {i18n.t('editProfile.form.saveChanges')}
                            </Button>
                        </View>
                    </Animated.ScrollView>
                </Containers.KeyboardAvoiding>
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('editProfile.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}
                />
            </View>
        );
    }
}

export const navigationName = 'app.EditProfile';
export function getNC(passProps: any = {}, options: any = {}) {
    return {
        component: {
            name: navigationName,
            passProps: passProps || {},
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
    ...(state.client.info || emptyObject),
    fetching: ReduxUtils.hasFetching(state, [API_CLIENT_EDIT]),
}))(withTheme(EditProfileScreen, getStyles));

reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
