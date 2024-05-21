// @flow
import auth from './auth';
// noinspection SpellCheckingInspection
import axios, {AxiosResponse, CancelTokenSource} from 'axios';
export type RequestMethod = 'get' | 'post' | 'patch' | 'delete';

//----------------------------------------------------
// axios interceptor
//----------------------------------------------------
axios.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
});

axios.interceptors.response.use((response) => {
    console.log('Response: ', response);
    return response;
});

/**
 * Очередь запросов
 */
export class QueueRequests {
    pool: Request[] = [];
    active: ?Request = null;

    add = (request: Request): QueueRequests => {
        request && this.pool.push(request);
        return this;
    };

    /**
     * @private
     */
    _next = () => {
        if (this.active) {
            this.active._queue = null;
            this.active = null;
        }
        if (this.pool.length < 1) {
            return;
        }
        this.active = this.pool.shift();
        if (!this.active) {
            return;
        }
        this.active._queue = this;
        this.active.start();
    };

    start = () => {
        this._next();
    };

    cancel = (message?: ?string) => {
        this.pool.forEach((request: Request) => {
            request._queue = null;
            request.cancel(message);
        });
        this.pool = [];
        if (this.active) {
            this.active._queue = null;
            this.active.cancel(message);
        }
        this.active = null;
    };
}

export type CallbackMethod = (v: any) => void;

export type CallbackType = 'after' | 'before' | 'success' | 'error';

/**
 * Запрос
 */
export default class Request {
    // Private props
    _queue: ?QueueRequests = null;
    _callbacks: {[key: CallbackType]: CallbackMethod[]} = {};

    // Public pros
    responseChecker: ?(response: AxiosResponse) => Promise<AxiosResponse> = null;
    cancelSource: ?CancelTokenSource = null;
    delayTimerId: ?any = null;
    promise: ?Promise<any> = null;
    method: RequestMethod = 'get';
    delay: ?number = undefined;
    options: ?any = undefined;
    waitAuth: boolean = true;
    data: ?any = undefined;
    url: ?string = null;

    isEmpty = (): boolean => (this.url || '').length < 3;

    get = (url: string, options?: ?any): Request => this.configure('get', url, undefined, options);

    delete = (url: string, options?: ?any): Request => this.configure('delete', url, undefined, options);

    post = (url: string, data?: ?any, options?: ?any): Request => this.configure('post', url, data, options);

    patch = (url: string, data?: ?any, options?: ?any): Request => this.configure('patch', url, data, options);

    configure = (method: RequestMethod, url: string, data?: ?any, options?: ?any): Request => {
        if (this.promise) {
            throw new Error('Cannot configure on running request!');
        }
        this.options = options;
        this.method = method;
        this.data = data;
        this.url = url;
        return this;
    };

    // noinspection JSUnusedGlobalSymbols
    withResponseChecker = (checker: (response: AxiosResponse) => Promise<AxiosResponse>): Request => {
        this.responseChecker = checker;
        return this;
    };

    cancel = (message: ?string = undefined) => {
        if (this.delayTimerId !== null) {
            clearTimeout(this.delayTimerId);
            this.delayTimerId = null;
        }
        if (!this.cancelSource) {
            return;
        }
        this.cancelSource.cancel(message);
        this.cancelSource = null;
        this.promise = null;
    };

    // noinspection JSUnusedGlobalSymbols
    removeAllCallbacks = (type: ?CallbackType = undefined): Request => {
        if (type) {
            if (type in this._callbacks) {
                delete this._callbacks[type];
            }
        } else {
            this._callbacks = {};
        }
        return this;
    };

    addCallback = (type: CallbackType, method: CallbackMethod): Request => {
        this._callbacks[type] = [...(this._callbacks[type] || []), method];
        return this;
    };

    after = (method: CallbackMethod): Request => this.addCallback('after', method);
    error = (method: CallbackMethod): Request => this.addCallback('error', method);
    before = (method: CallbackMethod): Request => this.addCallback('before', method);
    success = (method: CallbackMethod): Request => this.addCallback('success', method);

    // noinspection JSUnusedGlobalSymbols
    withDelay = (delay: number): Request => {
        this.delay = delay;
        return this;
    };

    // noinspection JSUnusedGlobalSymbols
    withOutWaitAuth = (): Request => {
        this.waitAuth = false;
        return this;
    };

    start = () => {
        this.cancel();
        if (this.isEmpty()) {
            this._queue && this._queue._next();
            return;
        }
        if (this.delay) {
            this.delayTimerId = setTimeout(() => {
                this.delayTimerId = null;
                requestAnimationFrame(this._send);
            }, this.delay);
            return;
        }
        requestAnimationFrame(this._send);
    };

    _handleCallbacks = (type: CallbackType, v: ?any = undefined) => {
        type in this._callbacks && (this._callbacks[type] || []).forEach((callback: CallbackMethod) => callback(v));
    };

    _req = () =>
        axios({
            ...(this.options || {}),
            url: this.url,
            data: this.data,
            method: this.method,
            ...(this.cancelSource
                ? {
                      cancelToken: this.cancelSource.token,
                  }
                : {}),
        });

    /**
     * @private
     */
    _send = () => {
        this._handleCallbacks('before');
        this.cancelSource = axios.CancelToken.source();
        this.promise = (this.waitAuth ? auth.waitRefreshing().then(this._req) : this._req())
            .then((response: AxiosResponse) => {
                if (this.responseChecker) {
                    return this.responseChecker(response);
                }
                return Promise.resolve(response);
            })
            .then((response: AxiosResponse) =>
                requestAnimationFrame(() => this._handleCallbacks('success', response.data)),
            )
            .catch((error: any) => {
                if (axios.isCancel(error)) {
                    return;
                }
                requestAnimationFrame(() => this._handleCallbacks('error', error));
            })
            .then(() => {
                this.cancelSource = null;
                requestAnimationFrame(() => {
                    this._handleCallbacks('after');
                    // noinspection JSUnresolvedFunction
                    this._queue && this._queue._next();
                    this.promise = null;
                });
            });
    };
}
