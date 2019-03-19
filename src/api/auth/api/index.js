import request from '@/utils/request'
// 数据采集
export function page(query) {
  return request({
    url: '/sd/datasourcelist',
    method: 'get',
    params: query
  })
}


export function getObj(obj) {
  return request({
    url: '/sd/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function verifyObj(query) {
  return request({
    url: '/sd/aipexist',
    method: 'get',
    params: query
  })
}

export function putObj(obj) {
  return request({
    url: '/sd/saveOrUpdate',
    method: 'post',
    data: obj
  })
}
// 数据标准
export function standerList(query) {
  return request({
    url: '/dc/getstd',
    method: 'get',
    params: query
  })
}
export function standerAdd(obj) {
  return request({
    url: '/dc/addstd',
    method: 'post',
    data: obj
  })
}

export function standerUp(obj) {
  return request({
    url: '/dc/updatestd',
    method: 'post',
    data: obj
  })
}
export function standerDel(obj) {
  return request({
    url: '/dc/delstd',
    method: 'post',
    data: obj
  })
}
export function standerState(query) {
  return request({
    url: '/dc/upstdsta',
    method: 'get',
    params: query
  })
}

// 标准信息统计
export function StatList(query) {
  return request({
    url: '/dc/accapilog',
    method: 'get',
    params: query
  })
}
