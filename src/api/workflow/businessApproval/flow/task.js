import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

/* 任务列表 */

// 获取任务列表
export function getTaskList(obj) {
  return request({
    url: agile + '/bpm/task/listJson',
    method: 'post',
    data: obj
  })
}

// 取消指派 (form data)
export function unLock(obj) {
  return request({
    url: agile + '/bpm/task/unLock',
    method: 'post',
    params: obj
  })
}

// 指派候选人
export function assignTask(obj) {
  return request({
    url: agile + '/bpm/task/assignTask',
    method: 'post',
    data: obj
  })
}

// 获取任务详情{taskId:}
export function getTaskInfo(obj) {
  return request({
    url: agile + '/bpm/task/getTaskData',
    method: 'get',
    params: obj
  })
}
