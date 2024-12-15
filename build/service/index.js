import request from '@/service/request';
export const getAPI = (url, data) => {
    return request({
        url: url,
        method: 'get',
        params: data,
    });
};
export const postAPI = (url, data) => {
    return request({
        url: url,
        method: 'post',
        data: data,
    });
};
//# sourceMappingURL=index.js.map