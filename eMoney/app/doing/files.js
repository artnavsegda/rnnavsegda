import _ from 'lodash';
import axios from 'axios';
import * as R from 'ramda';
import {API_URL} from '../constants';

export default {
    /**
     * Формирование источника получения файла
     *
     * @param o - объект
     * @param k - ключ поля
     * @param i - индекс, если значение ключа массив
     * @param _g - группа
     * @param _t - название ключа для вставки данных для авторизации
     *
     * @returns {null|{headers: {}, uri: string}|undefined}
     */
    sourceBy: (o: any, k: string = 'picture', i: number = 0, _g: string = 'image', _t: string = 'Token'): any => {
        if (!o) {
            return undefined;
        }
        const headers = {
            [_t]: axios.defaults.headers.common[_t] || '',
        };
        if (_.isString(o) || _.isNumber(o)) {
            return {
                uri: `${API_URL}/${_g}/${o}`,
                headers,
            };
        }
        if (!_.isObject(o)) {
            return null;
        }
        const id = (o || {})[k] || 0;
        if (!id) {
            return null;
        }
        return {
            uri: `${API_URL}/${_g}/${_.isArray(id) ? id[i] || 0 : id}`,
            headers,
        };
    },

    getPictureFlagName(themeName) {
        const pictureName = R.cond([
            [R.equals('light'), R.always('picture')],
            [R.equals('dark'), R.always('pictureBlack')],
            [R.T, R.always('picture')],
        ]);

        return pictureName(themeName);
    },
};
