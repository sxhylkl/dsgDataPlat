import request from '../../utils/request'
/**
 * @description: 最新10条
 */
export function getTop(num) {
  return request({
    url: `/curd_/Business/top/${num}`,
    method: 'get'
  })
}
/**
 * @description: 新增业务
 */
export function addTask(obj) {
  return request({
    url: '/curd_/Business',
    method: 'post',
    data: obj
  })
}
/**
 * @description: 更新业务
 */
export function updateTask(obj) {
  return request({
    url: `/curd_/Business/${obj.id}`,
    method: 'put',
    data: obj
  })
}
/**
 * @description: 删除业务
 */
export function delTask(id) {
  return request({
    url: `/curd_/Business/${id}`,
    method: 'delete'
  })
}
/**
 * @description: 获取业务列表
 */
export function getTaskList(id) {
  return request({
    url: `/curd_/Business/${id}/all`,
    method: 'get'
  })
}
// 获取关联信息
export function getRelationList(id) {
  return request({
    url: `/curd_/ResRelation/${id}/DATASOURCE/all`,
    method: 'get'
  })
}
