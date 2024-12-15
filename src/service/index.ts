import service from '@/service/request'

export const getAPI = (url: string, data: any) => {
  return service({
    url: url,
    method: 'get',
    params: data,
  })
}

export const postAPI = (url: string, data: any) => {
  return service({
    url: url,
    method: 'post',
    data: data,
  })
}
