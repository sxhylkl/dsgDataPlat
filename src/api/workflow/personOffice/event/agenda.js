import request from '@/utils/request'

const agile = url.agile

// 我的日程
export function getParticipantEvents(query) {
  return request({
    url: agile + '/calendar/schedule/getParticipantEvents',
    method: 'get',
    params: query
  })
}

export function getEvents(query) {
  return request({
    url: agile + '/calendar/schedule/getEvents',
    method: 'get',
    params: query
  })
}

// 用户查询
export function getUserList(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_userSelector',
    method: 'post',
    data: obj
  })
}

// 获取某个日程的信息
export function getEventInfo(query) {
  return request({
    url: agile + '/calendar/schedule/get',
    method: 'get',
    params: query
  })
}

// 添加日程
export function handleAgenda(obj) {
  return request({
    url: agile + '/calendar/schedule/save',
    method: 'post',
    data: obj
  })
}

// 完成日程
export function completeTask(obj) {
  return request({
    url: agile + '/calendar/schedule/completeTask',
    method: 'post',
    data: obj
  })
}

// 删除日程
export function delAgenda(query) {
  return request({
    url: agile + '/calendar/schedule/remove',
    method: 'get',
    params: query
  })
}

// 日程管理
// 列表
export function getAgendaList(obj) {
  return request({
    url: agile + '/calendar/schedule/listJson',
    method: 'post',
    data: obj
  })
}
