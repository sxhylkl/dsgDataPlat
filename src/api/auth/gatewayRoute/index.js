import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/auth/gatewayRoute/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/auth/gatewayRoute',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/auth/gatewayRoute/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/auth/gatewayRoute/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/auth/gatewayRoute/' + id,
    method: 'put',
    data: obj
  })
}
