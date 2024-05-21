//@flow
import _ from 'lodash';
import React from 'react';
import * as R from 'ramda';
import Widget from '../Widget';
import {connect} from 'react-redux';
import {FlatList} from 'react-native';
import {compareFnByIndex} from '../../utils';
import type {ReduxState} from '../../reducers';
import {MIN_SCREEN_SIZE, emptyObject, type Partition} from '../../constants';

import Section from '../Section';

import doing from '../../doing';
import i18n from '../../i18n';

type Props = {
    onPressPartition?: (partition: Partition) => any,
    filter?: (partition: Partition) => boolean,
    partitions?: {[code: string]: Partition},
    onPressMore?: () => any,
    style?: ?any,
};

const widgetSize = Math.max(48, MIN_SCREEN_SIZE / 5 - 8);

function renderPartitionItem(client, onPress?: (partition: Partition) => any): any {
    return function ({item}: any): any {
        console.log('CLIENT', client, item);

        const haveBadge = client.invoices > 0 && item.code === 'notifications' ? true : false;

        return (
            <Widget
                color="#fff"
                fontSize={12}
                variant="icon"
                size={widgetSize}
                caption={item.name}
                badge={haveBadge}
                imageHorizontalInset={14}
                backgroundColor={item.color}
                style={{paddingHorizontal: 2}}
                source={doing.api.files.sourceBy(item)}
                onPress={() => onPress && onPress(item)}
            />
        );
    };
}

const PartitionsList = ({style, partitions, client, onPressMore, onPressPartition}: Props) => {
    if (!(partitions && _.size(partitions) > 0)) {
        return null;
    }
    // noinspection RequiredAttributes
    return (
        <Section style={style} title={i18n.t('sections.partitions')} onPressAction={onPressMore}>
            <FlatList
                horizontal
                directionalLockEnabled
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}
                keyExtractor={(part: Partition) => part.code}
                contentContainerStyle={{paddingHorizontal: 14, paddingVertical: 10}}
                contentInsetAdjustmentBehavior="never"
                renderItem={renderPartitionItem(client, onPressPartition)}
                data={_.values(partitions).sort(compareFnByIndex)}
            />
        </Section>
    );
};

export default connect((state: ReduxState) => ({
    partitions: state.partitions || emptyObject,
    client: state.client.info || {},
}))(PartitionsList);
