// @flow
import Request from './request';

// https://community.algolia.com/places/api-clients.html#api-clients
const searchCityInfoRequest = (name: string, language?: string) =>
    new Request().post(
        'https://places-dsn.algolia.net/1/places/query',
        {
            language,
            type: 'city',
            query: name,
            hitsPerPage: 10,
        },
        {
            headers: {
                Token: undefined,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    );

export default {
    searchCityInfoRequest,
};
