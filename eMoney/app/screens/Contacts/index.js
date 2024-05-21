// @flow
import React from 'react';
import initials from 'initials';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {NavBar, Button, Typography} from '../../components';
import {ReduxUtils, type ReduxState} from '../../reducers';
import Contacts, {type Contact} from 'react-native-contacts';
import {statusBarStyleGetter, withTheme, type Theme} from '../../themes';
import {overlapScreenScrollValue, reformatPhoneNumber} from '../../utils';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {
    PermissionsAndroid,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Platform,
    Animated,
    Image,
    View,
} from 'react-native';

import doing from '../../doing';
import i18n from '../../i18n';

import getStyles from './styles';

export type SimpleContact = {
    givenName: string,
    phoneNumber: string,
    hasThumbnail: boolean,
    thumbnailPath: string,
};

export type Props = {
    onSelect?: (contact: SimpleContact) => any,
    isParentTabs?: boolean,
    hasAuthClient: boolean,
    hasNetwork: boolean,
    isModal?: boolean,
    componentId: any,
    theme: Theme,
    styles: any,
};

type State = {
    dataProvider: DataProvider,
    contacts: SimpleContact[],
    searchText: string,
    loading: boolean,
};

class ContactsScreen extends React.Component<Props, State> {
    scrollY: Animated.Value = new Animated.Value(0);
    layoutProvider: LayoutProvider = new LayoutProvider(
        () => 0,
        (type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = 60;
        },
    );
    searchTimerId: any = null;
    mounted: boolean = false;
    state: State = {
        dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]),
        searchText: '',
        loading: false,
        contacts: [],
    };

    componentDidMount() {
        this.mounted = true;
        Platform.select({
            ios: Promise.resolve(),
            android: PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                buttonPositive: 'Please accept bare mortal',
            }),
        }).then(this.reload);
    }

    componentWillUnmount() {
        this.mounted = false;
        this.clearSearchTimer();
    }

    reload = () => {
        setTimeout(() => {
            this.mounted &&
                this.setState({loading: true}, () => {
                    Contacts.getAll((err, contacts: Contact[]) => {
                        if (err === 'denied') {
                            return this.setState({loading: false});
                        }
                        let checkMap = {};
                        const items = contacts
                            .reduce((res: SimpleContact[], contact: Contact) => {
                                const jobInfo = contact.company || contact.jobTitle;
                                const givenName = [
                                    contact.givenName,
                                    contact.middleName,
                                    contact.familyName,
                                    jobInfo ? `(${jobInfo})` : undefined,
                                ]
                                    .filter((a) => !!a)
                                    .join(' ')
                                    .trim();
                                if (givenName.length < 1) {
                                    return res;
                                }
                                contact.phoneNumbers.forEach((phoneNumber) => {
                                    const key = reformatPhoneNumber(phoneNumber.number);
                                    if (!(key in checkMap)) {
                                        checkMap[key] = true;
                                        res.push({
                                            givenName,
                                            phoneNumber: phoneNumber.number,
                                            hasThumbnail: contact.hasThumbnail,
                                            thumbnailPath: contact.thumbnailPath,
                                        });
                                    }
                                });
                                return res;
                            }, [])
                            .sort((a: SimpleContact, b: SimpleContact) => a.givenName.localeCompare(b.givenName));
                        this.mounted &&
                            this.setState({
                                loading: false,
                                contacts: items,
                                dataProvider: this.state.dataProvider.cloneWithRows(items),
                            });
                    });
                });
        }, 1);
    };

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
        {useNativeDriver: false},
    );

    onPressClose = () => {
        if (this.props.isModal) {
            return Navigation.dismissModal(this.props.componentId);
        }
        return Navigation.pop(this.props.componentId);
    };

    onChangeSearchText = (text: string) => this.mounted && this.setState({searchText: text}, this.search);

    onPressContact = (contact: SimpleContact) => {
        this.props.onSelect && this.props.onSelect(contact);
        return this.onPressClose();
    };

    clearSearchTimer = () => {
        if (this.searchTimerId !== null) {
            clearTimeout(this.searchTimerId);
            this.searchTimerId = null;
        }
    };

    search = () => {
        this.clearSearchTimer();
        this.searchTimerId = setTimeout(() => {
            const q = this.state.searchText.toLowerCase().trim();
            this.searchTimerId = null;
            this.mounted &&
                this.setState({
                    dataProvider: this.state.dataProvider.cloneWithRows(
                        this.state.contacts.filter((contact: SimpleContact) => {
                            return contact.givenName.toLowerCase().includes(q) || contact.phoneNumber.includes(q);
                        }),
                    ),
                });
        }, 600);
    };

    rowRenderer = (type: number, data: any) =>
        type >= 0 ? (
            <Button variant="action" style={this.props.styles.contactButton} onPress={() => this.onPressContact(data)}>
                {data.hasThumbnail ? (
                    <Image
                        resizeMode="cover"
                        source={{uri: data.thumbnailPath}}
                        style={this.props.styles.contactThumbnail}
                    />
                ) : (
                    <View style={this.props.styles.contactThumbnail}>
                        <Typography variant="title">{initials(data.givenName).toUpperCase().slice(0, 2)}</Typography>
                    </View>
                )}
                <View style={{flex: 1}}>
                    <Typography style={{flex: 1}} variant="subheading" numberOfLines={1}>
                        {data.givenName}
                    </Typography>
                    <Typography variant="body1" numberOfLines={1} color="secondary">
                        {data.phoneNumber}
                    </Typography>
                </View>
            </Button>
        ) : null;

    render() {
        const {styles, theme, isModal} = this.props;
        return (
            <View testID="contacts" style={styles.container}>
                {this.state.dataProvider.getSize() > 0 ? (
                    <RecyclerListView
                        onScroll={this.onScroll}
                        rowRenderer={this.rowRenderer}
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.state.dataProvider}
                        style={{flex: 1, minWidth: 1, minHeight: 1}}
                        scrollViewProps={{
                            directionalLockEnabled: true,
                            contentInsetAdjustmentBehavior: 'never',
                            contentContainerStyle: styles.listContentContainer,
                        }}
                    />
                ) : (
                    <View style={styles.loader}>
                        <ActivityIndicator
                            hidesWhenStopped
                            size="small"
                            color={theme.colors.button}
                            animating={this.state.loading}
                        />
                    </View>
                )}
                <NavBar
                    showBackButton
                    withFillAnimation
                    useHardwareBackHandler
                    style={styles.fixedNavBar}
                    withBottomBorder="animated"
                    onPressBack={this.onPressClose}
                    title={i18n.t('contacts.title')}
                    scrollY={overlapScreenScrollValue(this.scrollY)}
                    translucentStatusBar={isModal ? 'adaptive' : true}>
                    <View style={styles.searchBar}>
                        <View style={styles.searchInputBlock}>
                            <TextInput
                                disableFullscreenUI
                                clearButtonMode="always"
                                style={styles.searchInput}
                                value={this.state.searchText}
                                placeholder={i18n.t('search')}
                                onChangeText={this.onChangeSearchText}
                                placeholderTextColor={theme.colors.secondaryText}
                            />
                        </View>
                    </View>
                </NavBar>
            </View>
        );
    }
}

export const navigationName = 'app.Contacts';
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

export function show(props: any = {}) {
    return Navigation.showModal(
        getNC({
            ...(props || {}),
            isModal: true,
        }),
    );
}

// noinspection JSUnusedLocalSymbols
const reduxConnector = connect((state: ReduxState, ownerProps: Props) => ({
    hasAuthClient: ReduxUtils.hasAuthClient(state),
    hasNetwork: state.indicators.net === 'online',
}))(withTheme(ContactsScreen, getStyles));

reduxConnector.show = show;
reduxConnector.getNC = getNC;
reduxConnector.usePersistor = false;
reduxConnector.navigationName = navigationName;

// noinspection JSUnusedGlobalSymbols
export default reduxConnector;
