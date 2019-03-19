import request from '@/utils/request'

// const url = 'http://192.168.23.52:10009'

export const getTree = params => { return request.get(`/curd_/ResourceDirController/${params}/tree`) };

export const createNode = params => { return request.post('/curd_/ResourceDirController', params) };

export const updateNode = params => { return request.put(`/curd_/ResourceDirController/${params.id}`, params) };

export const deleteNode = params => { return request.delete(`/curd_/ResourceDirController/${params}`) };