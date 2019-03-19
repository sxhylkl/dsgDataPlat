import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

// 发起申请

// 列表
export function getDefinition(obj) {
  return request({
    url: agile + '/bpm/my/definitionList',
    method: 'post',
    data: obj
  })
}

// 启动、保存草稿
export function doAction(obj) {
  return request({
    url: agile + '/bpm/instance/doAction',
    method: 'post',
    data: obj
  })
}

// 我的草稿

// 列表
export function getDraft (obj) {
  return request({
    url: agile + '/bpm/my/draftList',
    method: 'post',
    data: obj
  })
}

// 申请历史

// 列表
export function getApplyTask(obj) {
  return request({
    url: agile + '/bpm/my/applyTaskList',
    method: 'post',
    data: obj
  })
}
