import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/dict/dictType/page',
    method: 'get',
    params: query
  })
}

export function addTypeObj(obj) {
  return request({
    url: '/api/dict/dictType',
    method: 'post',
    data: obj
  })
}

export function getTypeObj(id) {
  return request({
    url: '/api/dict/dictType/' + id,
    method: 'get'
  })
}

export function delTypeObj(id) {
  return request({
    url: '/api/dict/dictType/' + id,
    method: 'delete'
  })
}

export function putTypeObj(id, obj) {
  return request({
    url: '/api/dict/dictType/' + id,
    method: 'put',
    data: obj
  })
}


export function getTree() {
  return request({
    url: '/api/dict/dictType/tree',
    method: 'get'
  })
}
