import request from '../../utils/request'

export function getObjList(query) {
  return request({
    url: '/modc/kafka/listAllTopic',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/modc/kafka/addOrUpdate',
    method: 'post',
    data: obj
  })
}
export function updateObj(obj) {
  return request({
    url: '/modc/kafka/addOrUpdate',
    method: 'post',
    data: obj
  })
}
export function delObj(id) {
  return request({
    url: `/modc/kafka/delete/${id}`,
    method: 'Delete'
  })
}
export function startObj(obj) {
  return request({
    url: '/modc/syncTopic/startService',
    method: 'post',
    data: obj
  })
}
export function stopObj(obj) {
  return request({
    url: '/modc/syncTopic/stopService',
    method: 'post',
    data: obj
  })
}
// 获取新增的topic
export function getTopicList(query) {
  return request({
    url: '/modc/kafka/listTopic',
    method: 'get',
    params: query
  })
}
// 获取kafa
export function getKafkaList(id) {
  return request({
    url: `curd_/DsgDatasource/${id}/all`,
    method: 'get'
  })
}
// 详情
export function getCollectList(query) {
  return request({
    url: '/modc/kafka/searchInfo',
    method: 'get',
    params: query
  })
}
// 详情表名的编辑
export function updateTableName(obj) {
  return request({
    url: '/modc/kafka/updateInfo',
    method: 'post',
    params: obj
  })
}


