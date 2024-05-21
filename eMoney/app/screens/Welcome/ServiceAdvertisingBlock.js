import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View} from 'react-native';
import {connect} from 'react-redux';
import {Section} from '../../components';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import FastImage from 'react-native-fast-image';
import {Navigation} from 'react-native-navigation';
import doing from '../../doing';
import type {ReduxState} from '../../reducers';

import {metrics} from '../../themes/dimensions';

import Payments from '../Payments';
import Services from '../Services';
import Partitions from '../Partitions';

import {getNC as getAdvertisingInfoNC} from '../AdvertisingInfo';

const separatorSize = 5;

class ServiceAdvertisingBlock extends Component {
    onPressAdvertising = (advertising: Advertising) => {
        console.log('ADVERSING', advertising);
        const {componentId} = this.props;
        if (advertising.autoOpen) {
            if (advertising.serviceId && advertising.serviceId > 0) {
                return Services.open(
                    componentId,
                    {
                        id: advertising.serviceId,
                    },
                    {
                        isParentTabs: true,
                    },
                )
                    .then(() => {})
                    .catch(() => {});
            }
            if (advertising.serviceGroupId && advertising.serviceGroupId > 0) {
                return Services.openGroupById(componentId, advertising.serviceGroupId, {
                    isParentTabs: true,
                });
            }
            if (advertising.moduleCode && advertising.moduleCode.length > 0) {
                Payments.resetNavigationStack();
                return Partitions.open(componentId, {
                    code: advertising.moduleCode,
                });
            }
        }
        return Navigation.push(
            componentId,
            getAdvertisingInfoNC(advertising, {
                isParentTabs: true,
            }),
        );
    };
    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    renderServiceCard = ({item}) => {
        return (
            <TouchableBounce
                style={{
                    borderRadius: 8,
                    width: metrics.screenWidth - 50,
                    height: 132,
                    backgroundColor: '#ff3466',
                    overflow: 'hidden',
                }}
                onPress={() => this.onPressAdvertising(item)}>
                <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={doing.api.files.sourceBy(item, 'mainPicture')}
                    style={{
                        //justifyContent: 'flex-end',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: metrics.screenWidth - 50,
                        height: 132,
                        borderRadius: 8,
                        flex: 1,
                        backgroundColor: '#434356',
                    }}
                />
            </TouchableBounce>
        );
    };
    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    renderSeparator = () => {
        return <View style={{height: 30, width: 10}} />;
    };

    render() {
        const {adversingData, style, contentContainerStyle} = this.props;
        return (
            <Section style={style} title={adversingData.name}>
                <FlatList
                    horizontal
                    directionalLockEnabled
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={{paddingHorizontal: 20}}
                    contentInsetAdjustmentBehavior="never"
                    data={adversingData.items}
                    keyExtractor={(item) => `s.${item.id}`}
                    renderItem={this.renderServiceCard}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </Section>
        );
    }
}

ServiceAdvertisingBlock.defaultProps = {
    loadingId: 0,
};

ServiceAdvertisingBlock.separatorSize = separatorSize;

export default connect((state: ReduxState) => ({
    hasDarkOverlay: state.theme.name === 'dark',
}))(ServiceAdvertisingBlock);
