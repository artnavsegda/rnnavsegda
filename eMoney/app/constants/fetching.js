//@flow
import _ from 'lodash';

export const WAIT_TIMEOUT = 20000;

const FETCHING_KEY_END_CHAR = ']';
const FETCHING_KEY_START_CHAR = '[';
const FETCHING_REQUEST_KEY = `${FETCHING_KEY_START_CHAR}->${FETCHING_KEY_END_CHAR}`;
const FETCHING_SUCCESS_KEY = `${FETCHING_KEY_START_CHAR}<-${FETCHING_KEY_END_CHAR}`;
const FETCHING_FAILURE_KEY = `${FETCHING_KEY_START_CHAR}|<${FETCHING_KEY_END_CHAR}`;

const MIN_LENGTH_TYPE_FOR_FETCHING = 4;

export const hasFetchingKey = (type: string): boolean => {
    return (
        type.length > MIN_LENGTH_TYPE_FOR_FETCHING &&
        type[type.length - 4] === FETCHING_KEY_START_CHAR &&
        type[type.length - 1] === FETCHING_KEY_END_CHAR
    );
};

export const hasFailureKey = (type: string): boolean => {
    return _.endsWith(type, FETCHING_FAILURE_KEY);
};

export const getFetchingInfo = (type: string): {actionType: string, fetching: boolean} => {
    return type.length > MIN_LENGTH_TYPE_FOR_FETCHING
        ? {
              actionType: type.slice(0, -MIN_LENGTH_TYPE_FOR_FETCHING).trim(),
              fetching: type.slice(-MIN_LENGTH_TYPE_FOR_FETCHING).trim() === FETCHING_REQUEST_KEY,
          }
        : {actionType: '', fetching: false};
};

export const _REQUEST = (code: string): string => {
    return `${code} ${FETCHING_REQUEST_KEY}`;
};

export const _SUCCESS = (code: string): string => {
    return `${code} ${FETCHING_SUCCESS_KEY}`;
};

export const _FAILURE = (code: string): string => {
    return `${code} ${FETCHING_FAILURE_KEY}`;
};
