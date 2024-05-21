//@flow
import {handleActions} from 'redux-actions';
import {_SUCCESS, API_FAQ_GET_ITEMS, API_FAQ_GET_ANSWERS, type FAQGroup, FAQ} from '../constants';

export type ReduxState = {
    items: {[id: number]: FAQGroup},
    answers: {[id: number]: FAQ},
};

const reducer = handleActions(
    {
        [_SUCCESS(API_FAQ_GET_ITEMS)]: (state, {payload}) => ({
            ...state,
            items: (payload || []).reduce((m, group: FAQGroup, index: number) => {
                group.index = index;
                m[group.id] = group;
                return m;
            }, {}),
        }),
        [_SUCCESS(API_FAQ_GET_ANSWERS)]: (state, {questionId, payload}) => ({
            ...state,
            answers: {
                ...(state.answers || {}),
                [questionId]: payload,
            },
        }),
    },
    {
        answers: {},
        items: {},
    },
);

export default reducer;
