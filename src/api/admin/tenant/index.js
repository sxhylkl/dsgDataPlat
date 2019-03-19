import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'put',
    data: obj
  })
}

export function updateUser(id, obj) {
  return request({
    url: '/api/admin/tenant/' + id + '/user',
    method: 'put',
    params: obj
  })
}

export function getOwner(id) {
  return request({
    url: '/api/admin/tenant/' + id + '/user',
    method: 'get'
  });
}
