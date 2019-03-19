import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

/* 常用脚本 */

// 获取流程实例列表
export function getScriptList(obj) {
  return request({
    url: agile + '/sys/script/listJson',
    method: 'post',
    data: obj
  })
}

// 测试脚本的接口{script: ,key:'name'},Form Data
export function executeScript(obj) {
  return request({
    url: agile + '/sys/script/executeScript',
    method: 'post',
    data: obj
  })
}

// 保存{category: , memo: , name: ,script:}
export function save(obj) {
  return request({
    url: agile + '/sys/script/save',
    method: 'post',
    data: obj
  })
}

// 获取脚本的详情
export function getScriptDetail(obj) {
  return request({
    url: agile + '/sys/script/get',
    method: 'post',
    params: obj
  })
}

// 删除脚本{id:}
export function remove(obj) {
  return request({
    url: agile + '/sys/script/remove',
    method: 'post',
    params: obj
  })
}

