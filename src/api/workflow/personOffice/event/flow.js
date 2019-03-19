import request from '@/utils/request'
// const url = require('static/baseurl/other');
const agile = url.agile

// 待办事项

// 流程图
export function getFlowImage() {
  return agile + '/bpm/instance/flowImage'
}

// 获取详情
export function getTaskDetail(query) {
  return request({
    url: agile + '/bpm/task/getTaskData',
    method: 'get',
    params: query
  })
}

// 待办事项列表
export function getTodoTask(obj) {
  return request({
    url: agile + '/bpm/my/todoTaskList',
    method: 'post',
    data: obj
  })
}

// 同意、驳回
export function doAction(obj) {
  return request({
    url: agile + '/bpm/task/doAction',
    method: 'post',
    data: obj
  })
}

// 审批历史
export function getApprovalHistory(obj) {
  return request({
    url: agile + '/bpm/instance/getInstanceOpinion',
    method: 'post',
    params: obj
  })
}

// 办理历史

// 办理历史列表
export function getApprove (obj) {
  return request({
    url: agile + '/bpm/my/approveList',
    method: 'post',
    data: obj
  })
}

// 详情
export function getApproveDetail (query) {
  return request({
    url: agile + '/bpm/instance/getInstanceData',
    method: 'get',
    params: query
  })
}

// 使用
/**
 * getInfo().then(response => {
          //正确的操作
        }).catch(error => {
          //错误的操作
        })
 */
