// @flow
import _ from 'lodash';
import doing from '../../doing';
import {navigate} from '../../utils';
import type {Service, ServiceBlock, ServiceGroup} from '../../constants';

import {getNC as getLocalTransferFormNC} from './LocalTransferForm';
import {getNC as getQrTransferFormNC} from './QrTransferForm';
import {getNC as getReplenishFormNC} from './ReplenishForm';
import {getNC as getGroupServicesNC} from './GroupServices';
import {getNC as getBlockGroupsNC} from './BlockGroups';
import {getNC as getServiceFormNC} from './ServiceForm';

import CameraDetectClient from './CameraDetectClient';

type Options = {
    id?: number,
    service?: Service,
    group?: ServiceGroup,
    block?: ServiceBlock,
};

const openGroupById = (componentId: any, groupId: number, props: any = {}): Promise<any> =>
    navigate(componentId, getGroupServicesNC(groupId, props));

const openBlockById = (componentId: any, type: number, blockId: number, props: any = {}): Promise<any> =>
    navigate(componentId, getBlockGroupsNC(type, blockId, props));

const open = (componentId: any, options: Options, props: any = {}): Promise<any> => {
    if (!options) {
        return Promise.resolve();
    }
    if (options.block) {
        return openBlockById(componentId, options.block.type, options.block.id, props);
    }
    if (options.group && (options.service || options.group.service)) {
        const service = options.service || options.group.service;
        if (service.code) {
            switch (_.toLower(service.code)) {
                case 'transfer':
                    return navigate(componentId, getLocalTransferFormNC(props));
                case 'recharge':
                    return navigate(componentId, getReplenishFormNC(props));
                case 'qrcode':
                case 'clientqrcode':
                    return CameraDetectClient.show({
                        onConfirmDetection: (client: any, data: string) =>
                            client && navigate(componentId, getQrTransferFormNC(service, client, data, props)),
                    });
                default:
                    break;
            }
        }
        return navigate(componentId, getServiceFormNC(service, options.group, props));
    } else if (options.group && !options.id) {
        return openGroupById(componentId, options.group.id, props);
    } else if (options.id) {
        return new Promise<*>((resolve) => {
            doing.api.services
                .findInfoRequest(options.id)
                .error(() => resolve())
                .success((group: ?ServiceGroup) => {
                    if (!group) {
                        return resolve();
                    }
                    navigate(componentId, getServiceFormNC(group.service, group, props)).then(resolve).catch(resolve);
                })
                .start();
        });
    }
    return Promise.resolve();
};

export default {
    open,
    openGroupById,
};
