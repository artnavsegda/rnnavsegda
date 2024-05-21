//@flow
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import {SupportedPartitions, type Partition} from '../../constants';
import {getNC as getHistoryNC} from '../History';
import {getNC as getNotificationsNC} from '../NotificationsHistory';
import {getState} from '../../doing/store';
import Services from '../Services';
import type {ServiceBlock} from '../../constants';

// noinspection JSUnusedLocalSymbols
const open = (componentId: any, partition: Partition, options: any = {}) => {
    if (!partition) {
        return;
    }
    switch (partition.code) {
        case SupportedPartitions.qrcode: {
            // find service
            const group = _.values(getState().services.groups).find(
                (a: any) => (a.service?.code || '').toLowerCase() === 'clientqrcode',
            );
            if (!group) {
                break;
            }
            return Services.open(componentId, {group});
        }
        case SupportedPartitions.recharge: {
            // 2 - recharge
            const block: ?ServiceBlock = _.first(_.values(getState().services.blocks[5]));
            if (!block) {
                return;
            }
            return Services.open(componentId, {block});
        }
        case SupportedPartitions.history:
            return Navigation.push(
                componentId,
                getHistoryNC({
                    isModal: false,
                }),
            );
        case SupportedPartitions.pay:
        case SupportedPartitions.transfer:
            return Navigation.mergeOptions(componentId, {
                bottomTabs: {
                    currentTabIndex: partition.code === SupportedPartitions.transfer ? 3 : 2,
                },
            });
        case SupportedPartitions.notificationsHistory:
            return Navigation.push(
                componentId,
                getNotificationsNC({
                    isModal: false,
                }),
            );
        default: {
            const group = _.values(getState().services.groups).find(
                (a: any) => (a.service?.code || '').toLowerCase() === partition.code.toLowerCase(),
            );
            if (!group) {
                break;
            }
            return Services.open(componentId, {group});
        }
    }
};

export default {
    open,
};
