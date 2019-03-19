import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/depart/page',
    method: 'get',
    params: query
  })
}

export function addDepartObj(obj) {
  return request({
    url: '/api/admin/depart',
    method: 'post',
    data: obj
  })
}

export function getDepartObj(id) {
  return request({
    url: '/api/admin/depart/' + id,
    method: 'get'
  })
}

export function delDepartObj(id) {
  return request({
    url: '/api/admin/depart/' + id,
    method: 'delete'
  })
}

export function putDepartObj(id, obj) {
  return request({
    url: '/api/admin/depart/' + id,
    method: 'put',
    data: obj
  })
}

export function getTree() {
  return request({
    url: '/api/admin/depart/tree',
    method: 'get'
  })
}

export function addUserObj(data) {
  return request({
    url: '/api/admin/depart/user',
    method: 'post',
    params: data
  })
}

export function delUserObj(data) {
  return request({
    url: '/api/admin/depart/user',
    method: 'delete',
    params: data
  })
}

export function getUsers(query) {
  return request({
    url: '/api/admin/depart/user',
    method: 'get',
    params: query
  })
}