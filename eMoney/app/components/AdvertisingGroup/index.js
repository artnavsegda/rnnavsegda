//@flow
import _ from 'lodash';
import Color from 'color';
import {connect} from 'react-redux';
import React, {useState} from 'react';
import * as R from 'ramda';
import {elevationStyle} from '../../themes';
import FastImage from 'react-native-fast-image';
import {Navigation} from 'react-native-navigation';
import {MIN_SCREEN_SIZE, type Advertising} from '../../constants';
import {ScrollView, StyleSheet, ActivityIndicator, View} from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

import {Typography} from '../UIKit';
import Section from '../Section';

import doing from '../../doing';

import Payments from '../../screens/Payments';
import Services from '../../screens/Services';
import Partitions from '../../screens/Partitions';

import {getNC as getAdvertisingInfoNC} from '../../screens/AdvertisingInfo';
import type {ReduxState} from '../../reducers';

export type Props = {
    contentContainerStyle?: any,
    hasDarkOverlay?: boolean,
    isParentTabs?: boolean,
    componentId?: any,
    viewType: number,
    name: string,
    items: any,
    id: number,
    style?: any,
};

const separatorSize = 5;
const cubeSize = MIN_SCREEN_SIZE / 1.75 - separatorSize * 4;
const cubeCellSize = (cubeSize - separatorSize * 2) / 2;
const itemStyle = {
    borderRadius: 8,
    backgroundColor: '#D8D8D8',
    ...elevationStyle(1),
};

function getCubeStyle(viewType: number) {
    if (viewType === 2) {
        return {
            width: cubeCellSize * 1.5,
            borderRadius: 18,
            aspectRatio: 1,
        };
    } else if (viewType === 3) {
        return {
            width: Math.max(1, (4 - viewType) * 1.05) * cubeCellSize,
            height: Math.min(2, Math.max(1, viewType) * 1.2) * cubeCellSize,
        };
    } else if (viewType === 4) {
        return {
            width: cubeCellSize,
            height: cubeCellSize,
        };
    } else if (viewType === 1) {
        return {
            width: Math.max(1, (4 - viewType) * 1.05) * cubeCellSize,
            height: Math.min(2, Math.max(1, viewType) * 1.2) * cubeCellSize,
        };
    }
}

function getCubeCellStyle(index: number, item: Advertising): any {
    return {
        ...itemStyle,
        position: 'absolute',
        left: index > 1 ? cubeCellSize + separatorSize * 2 : 0,
        top: index === 1 || index === 3 ? cubeCellSize + separatorSize * 2 : 0,
        width: cubeCellSize * Math.min(2, Math.max(1, item.width)) + (item.width > 1 ? separatorSize * 2 : 0),
        height: cubeCellSize * Math.min(2, Math.max(1, item.height)) + (item.height > 1 ? separatorSize * 2 : 0),
    };
}

function getTableWidth(items: any, size: number): number {
    if (!(2 in items || 3 in items)) {
        const w = Math.min(2, Math.max(1, Math.max((items[1] || {}).width || 1, (items[0] || {}).width || 1)));
        if (w < 2) {
            return size / 2 - separatorSize;
        }
    }
    return size;
}

function renderLoader(borderRadius: number = 8): any {
    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                {borderRadius, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.334)'},
            ]}>
            <ActivityIndicator size="small" color="#fff" animating />
        </View>
    );
}

function renderItem(
    item: Advertising,
    hasDarkOverlay: boolean,
    viewType: number,
    loadingId: number,
    onPress?: (ad: Advertising) => any,
): any {
    const isDark = item.colorText ? Color(item.colorText).lighten(0.1).isDark() : hasDarkOverlay;
    const nameTextIsVisible = R.pathOr(true, ['isViewNameOnPicture'], item);

    console.log('NAME', item.name);

    const RenderComponent = !nameTextIsVisible ? (
        <View />
    ) : (
        false
    );

    return (
        <TouchableBounce style={[itemStyle, getCubeStyle(viewType)]} onPress={() => onPress && onPress(item)}>
            <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={doing.api.files.sourceBy(item, 'mainPicture')}
                style={{
                    justifyContent: viewType === 2 ? 'flex-end' : 'flex-start',
                    borderRadius: viewType === 2 ? 18 : 8,
                    flex: 1,
                }}>
                {RenderComponent}
                <View style={{padding: viewType <= 2 ? 12 : 8}}>
                    {nameTextIsVisible && (
                        <Typography
                            style={{
                                width: viewType <= 1 ? '50%' : '100%',
                            }}
                            fontWeight={viewType <= 2 ? 'bold' : 'normal'}
                            color={item.colorText || 'primary'}>
                            {item.name}
                        </Typography>
                    )}
                    {loadingId === item.id ? renderLoader(viewType === 2 ? 18 : 8) : null}
                </View>
            </FastImage>
        </TouchableBounce>
    );
}

function renderCubeCell(
    index: number,
    item: Advertising,
    loadingId: number,
    hasDarkOverlay: boolean,
    onPress?: (ad: Advertising) => any,
) {
    const isDark = item.colorText ? Color(item.colorText).lighten(0.1).isDark() : hasDarkOverlay;
    const nameTextIsVisible = R.pathOr(true, ['isViewNameOnPicture'], item);
    return (
        <TouchableBounce style={getCubeCellStyle(index, item)} onPress={() => onPress && onPress(item)}>
            <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={doing.api.files.sourceBy(item, 'mainPicture')}
                style={{flex: 1, borderRadius: 8, justifyContent: 'flex-end'}}>
                <View style={{padding: 8}}>
                    {nameTextIsVisible && <Typography color={item.colorText || 'primary'}>{item.name}</Typography>}
                </View>
            </FastImage>
            {loadingId === item.id ? renderLoader(8) : null}
        </TouchableBounce>
    );
}

const AdvertisingGroup = ({
    id,
    name,
    items,
    style,
    viewType,
    componentId,
    isParentTabs,
    hasDarkOverlay,
    contentContainerStyle,
}: Props) => {
    const [loadingId, setLoadingId] = useState(0);
    const onPressAdvertising = (advertising: Advertising) => {
        if (advertising.autoOpen) {
            if (advertising.serviceId && advertising.serviceId > 0) {
                if (loadingId) {
                    return;
                }
                setLoadingId(advertising.id);
                return Services.open(
                    componentId,
                    {
                        id: advertising.serviceId,
                    },
                    {
                        isParentTabs,
                    },
                )
                    .then(() => setLoadingId(0))
                    .catch(() => setLoadingId(0));
            }
            if (advertising.serviceGroupId && advertising.serviceGroupId > 0) {
                return Services.openGroupById(componentId, advertising.serviceGroupId, {
                    isParentTabs,
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
                isParentTabs,
            }),
        );
    };
    return (
        <Section style={style} title={name}>
            <ScrollView
                horizontal
                removeClippedSubviews
                directionalLockEnabled
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={contentContainerStyle}
                contentInsetAdjustmentBehavior="never"
                style={{alignSelf: 'stretch', marginBottom: separatorSize}}>
                {viewType > 0 ? (
                    _.isArray(items) ? (
                        (items || []).map((item: Advertising) => (
                            <View key={`i.${id}.${item.id}`} style={{margin: separatorSize}}>
                                {renderItem(item, hasDarkOverlay || false, viewType, loadingId, onPressAdvertising)}
                            </View>
                        ))
                    ) : (
                        <View />
                    )
                ) : (
                    _.keys(items)
                        .sort()
                        .map((key: any) => (
                            <View
                                key={`c.${id}.${key}`}
                                style={{
                                    width: getTableWidth(items[key], cubeSize),
                                    margin: separatorSize,
                                    height: cubeSize,
                                }}>
                                {0 in items[key]
                                    ? renderCubeCell(
                                          0,
                                          items[key][0],
                                          loadingId,
                                          hasDarkOverlay || false,
                                          onPressAdvertising,
                                      )
                                    : null}
                                {1 in items[key]
                                    ? renderCubeCell(
                                          1,
                                          items[key][1],
                                          loadingId,
                                          hasDarkOverlay || false,
                                          onPressAdvertising,
                                      )
                                    : null}
                                {2 in items[key]
                                    ? renderCubeCell(
                                          2,
                                          items[key][2],
                                          loadingId,
                                          hasDarkOverlay || false,
                                          onPressAdvertising,
                                      )
                                    : null}
                                {3 in items[key]
                                    ? renderCubeCell(
                                          3,
                                          items[key][3],
                                          loadingId,
                                          hasDarkOverlay || false,
                                          onPressAdvertising,
                                      )
                                    : null}
                            </View>
                        ))
                )}
            </ScrollView>
        </Section>
    );
};

AdvertisingGroup.defaultProps = {
    loadingId: 0,
};

AdvertisingGroup.separatorSize = separatorSize;

export default connect((state: ReduxState) => ({
    hasDarkOverlay: state.theme.name === 'dark',
}))(AdvertisingGroup);
