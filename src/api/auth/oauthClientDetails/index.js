import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/auth/oauthClientDetails/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/auth/oauthClientDetails',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/auth/oauthClientDetails/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/auth/oauthClientDetails/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/auth/oauthClientDetails/' + id,
    method: 'put',
    data: obj
  })
}
