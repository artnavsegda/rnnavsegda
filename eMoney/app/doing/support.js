import {buildApiRequest} from './utils';
import {defArray, defObject} from '../utils';
import RNTextSize from 'react-native-text-size';
import {
    API_SUPPORT_GET_ITEMS,
    API_SUPPORT_SEND_MESSAGE,
    MAX_MESSAGE_TEXT_WIDTH,
    type SupportMessage,
} from '../constants';

const defaultFontSize: number = 14;
const defaultFontSpecs = {
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontFamily: 'Geometria',
    fontSize: defaultFontSize,
};

const getItemsRequest = (pageNumber: number = 0, pageSize: number = 100, reload: boolean = false) =>
    buildApiRequest({
        method: 'GET',
        target: '/support',
        outlets: {pageNumber, pageSize, reload},
        options: {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
            },
        },
        defMethod: defArray,
        action: API_SUPPORT_GET_ITEMS,
    }).withResponseChecker(
        (response) =>
            new Promise((resolve) => {
                RNTextSize.flatHeights({
                    width: MAX_MESSAGE_TEXT_WIDTH,
                    text: (response.data || []).map((a: SupportMessage) => a.text.trim()),
                    ...defaultFontSpecs,
                })
                    .then((heights: number[]) => {
                        response.data = (response.data || []).map((item: any, index: number) => ({
                            ...item,
                            fontSize: defaultFontSize,
                            textHeight: index >= 0 && index < heights.length ? heights[index] : undefined,
                        }));
                        resolve(response);
                    })
                    .catch(() => resolve(response));
            }),
    );

const sendMessageRequest = (text: string) =>
    buildApiRequest({
        method: 'POST',
        target: '/support/add',
        data: {
            Text: text,
        },
        defMethod: defObject,
        action: API_SUPPORT_SEND_MESSAGE,
    }).withResponseChecker(
        (response) =>
            new Promise((resolve, reject) => {
                if (!(response.data && response.data.text)) {
                    if ('result' in response.data) {
                        if ('errorMessage' in response.data) {
                            return reject(new Error(response.data.errorMessage));
                        }
                        return reject(new Error(`Response result code is error - ${response.data.result}!`));
                    }
                    return reject(new Error('Text not found!'));
                }
                RNTextSize.flatHeights({
                    width: MAX_MESSAGE_TEXT_WIDTH,
                    text: [((response.data || {}).text || '').trim()],
                    ...defaultFontSpecs,
                })
                    .then((heights: number[]) => {
                        response.data.fontSize = defaultFontSize;
                        response.data.textHeight = heights.length > 0 ? heights[0] : undefined;
                        resolve(response);
                    })
                    .catch(() => resolve(response));
            }),
    );

export default {
    getItemsRequest,
    sendMessageRequest,
    messageFontSpecs: defaultFontSpecs,
};
