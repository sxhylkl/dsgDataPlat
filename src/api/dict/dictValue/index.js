import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/dict/dictValue/page',
    method: 'get',
    params: query
  })
}

export function addValueObj(obj) {
  return request({
    url: '/api/dict/dictValue',
    method: 'post',
    data: obj
  })
}

export function getValueObj(id) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'get'
  })
}

export function delValueObj(id) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'delete'
  })
}

export function putValueObj(id, obj) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'put',
    data: obj
  })
}

export function getTypeValue(code) {
  return request({
    url: '/api/dict/dictValue/type/' + code,
    method: 'get'
  })
}
