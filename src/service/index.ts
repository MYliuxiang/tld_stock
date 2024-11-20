import request from '@/service/request'

export const getAPI = (url: string, data: any) => {
  return request({
    url: url,
    method: 'get',
    params: data,
  })
}

export const postAPI = (url: string, data: any) => {
  return request({
    url: url,
    method: 'get',
    data: data,
  })
}
