//@flow
import {handleActions} from 'redux-actions';
import {
    API_SERVICES_FIND_INFO_BY_ID,
    API_SERVICES_GET_GROUP_ITEMS,
    API_SERVICES_GET_GROUPS,
    _SUCCESS,
    type ServiceBlock,
    type ServiceGroup,
    type Service,
} from '../constants';

export type ReduxState = {
    groups: {[groupId: number]: ServiceGroup},
    blocks: {[type: number]: {[blockId: number]: ServiceBlock}},
    groupItems: {[groupId: number]: {[serviceId: number]: Service}},
};

const reducer = handleActions(
    {
        [_SUCCESS(API_SERVICES_FIND_INFO_BY_ID)]: (state: ReduxState, {payload}: any) => {
            if (payload && payload.id && payload.service) {
                return {
                    ...state,
                    groups: {
                        ...state.groups,
                        ...(!(payload.id in state.groups)
                            ? {
                                  [payload.id]: payload,
                              }
                            : {}),
                    },
                    groupItems: {
                        ...state.groupItems,
                        [payload.id]: {
                            ...(state.groupItems[payload.id] || {}),
                            [payload.service.id]: {
                                ...((state.groupItems[payload.id] || {})[payload.service.id] || {}),
                                ...payload.service,
                            },
                        },
                    },
                };
            }
            return state;
        },
        [_SUCCESS(API_SERVICES_GET_GROUPS)]: (state: ReduxState, {payload}: any) => ({
            ...state,
            groups: (payload || []).reduce((m: any, block: ServiceBlock) => {
                if ((block.groups || []).length > 0) {
                    block.groups.forEach((group: ServiceGroup) => {
                        m[group.id] = group;
                    });
                }
                return m;
            }, {}),
            blocks: (payload || []).reduce((m: any, block: ServiceBlock, index: number) => {
                // FIXME - костыль
                //    if (block.type === 0) {
                //        block.type = 2;
                //    } else if (block.type === 1) {
                //        block.type = 4;
                //    } else if (block.type === 2) {
                //        block.type = 5;
                //    }
                block.index = index;
                if (!(block.type in m)) {
                    m[block.type] = {};
                }
                m[block.type][block.id] = block;
                return m;
            }, {}),
        }),
        [_SUCCESS(API_SERVICES_GET_GROUP_ITEMS)]: (state: ReduxState, {groupId, payload}: any) => ({
            ...state,
            groupItems: {
                ...(state.groupItems || {}),
                [groupId]: (payload || []).reduce((m: any, service: Service, index: number) => {
                    service.index = index;
                    m[service.id] = service;
                    return m;
                }, {}),
            },
        }),
    },
    {
        blocks: {},
        groups: {},
        groupItems: {},
    },
);

export default reducer;
