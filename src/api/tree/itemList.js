import request from '@/utils/request'

// const url = 'http://192.168.23.52:10003'

export const getTab = params => { return request.get(`/curd_/StandardBase/${params}/all`) };

export const getAllTab = params => { return request.get(`/curd_/StandardBase/all`) };

export const createTab = params => { return request.post(`/curd_/StandardBase`, params) };

export const updateTab = params => { return request.put(`/curd_/StandardBase/${params.id}`, params) };

export const deleteTab = params => { return request.delete(`/curd_/StandardBase/${params}`) };
export const getType = () => { return request.get('/curd_/StandardBase/getType') };
export function getTop() {
  return request({
    url: '/curd_/StandardBase/top/10',
    method: 'get'
  })
}