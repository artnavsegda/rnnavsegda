//@flow

function hasAuthClient({auth, client}: any): boolean {
    return auth.token && client.info && (client.info.clientGuid || '').length > 4;
}

function hasFetching({fetching}: any, keys: string[]): boolean {
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] in fetching && fetching[keys[i]]) {
            return true;
        }
    }
    return false;
}

export default {
    hasAuthClient,
    hasFetching,
};
