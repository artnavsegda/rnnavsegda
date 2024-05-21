import _ from 'lodash';
import {dispatch} from './store';
import {getErrorInfo} from '../utils';
import Request, {type RequestMethod} from './request';
import {_FAILURE, _REQUEST, _SUCCESS, API_URL} from '../constants';

type BuildOptions = {
    _pfx?: string | number,
    method: RequestMethod,
    target: string,
    action?: string,
    options?: any,
    data?: any,
    outlets?: any,
    defMethod?: (v: any) => any,
};

// noinspection JSUnusedGlobalSymbols
export function buildApiRequest(options: BuildOptions): Request {
    const request = new Request().configure(
        options.method,
        `${API_URL}${options.target}`,
        options.data,
        options.options,
    );
    if (!options.action) {
        return request;
    }
    const _inj = !_.isUndefined(options._pfx) && options._pfx !== null ? {_pfx: options._pfx} : {};
    return request
        .before(() => {
            options.action && dispatch({..._inj, type: _REQUEST(options.action)});
        })
        .success((data: any) => {
            options.action &&
                dispatch({
                    ...(options.outlets || {}),
                    ..._inj,
                    payload: options.defMethod ? options.defMethod(data) : data,
                    type: _SUCCESS(options.action),
                });
        })
        .error((error: any) => {
            options.action &&
                dispatch({
                    ...(options.outlets || {}),
                    ...getErrorInfo(error),
                    ..._inj,
                    error,
                    type: _FAILURE(options.action),
                });
        });
}
