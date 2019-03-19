import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

/* 流程实例 */

// 获取流程实例列表
export function getInstanceList(obj) {
  return request({
    url: agile + '/bpm/instance/listJson',
    method: 'post',
    data: obj
  })
}

// 获取流程实例详情
export function getInstanceDetail(data) {
  return request({
    url: agile + '/bpm/instance/getInstanceData',
    method: 'post',
    params: data
  })
}

// 挂起
export function pending(data) {
  return request({
    url: agile + '/bpm/instance/toForbidden',
    method: 'post',
    params: data
  })
}
