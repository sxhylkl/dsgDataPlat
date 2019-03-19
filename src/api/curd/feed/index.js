// 任务管理的
import request from '@/utils/request'

/**
 * @description: 获取最近任务
 * @param { }
 * @return: { }
 */
export function getTopTask() {
  return request({
    url: '/curd_/DsgTask/top/10',
    method: 'get'
  })
}
/**
 * @description: 获取最近流程
 * @param { }
 * @return: { }
 */
export function getTopFeed(param) {
  return request({
    url: '/datalake-feed_/v1/feedmgr/feeds',
    method: 'get',
    params: param
  })
}
/**
 * @description: 获取数据源
 * @param { }
 * @return: { }
 */
export function getDataSource(param) {
  return request({
    url: '/datalake-feed_/v1/feedmgr/feeds',
    method: 'get',
    params: param
  })
}
/**
 * @description: 新建任务
 * @param { }
 * @return: { }
 */
export function addTask(obj) {
  return request({
    url: '/curd_/DsgTask',
    method: 'post',
    data: obj
  })
}
/**
 * @description: 更新任务
 * @param { }
 * @return: { }
 */
export function updateTask(obj) {
  return request({
    url: `/curd_/DsgTask/${obj.id}`,
    method: 'put',
    data: obj
  })
}
/**
 * @description: 根据分类获取任务
 * @param { }
 * @return: { }
 */
export function getTask(id) {
  return request({
    url: `/curd_/DsgTask/${id}/all`,
    method: 'get'
  })
}
/**
 * @description: 删除任务
 * @param { }
 * @return: { }
 */
export function delTask(id) {
  return request({
    url: `/curd_/DsgTask/${id}`,
    method: 'delete'
  })
}
/**
 * @description: 查看详情
 * @param { }
 * @return: { }
 */
export function detailTask(id) {
  return request({
    url: `/curd_/DsgTask/getTask/${id}`,
    method: 'get'
  })
}
/**
 * @description: 根据任务获取流程
 * @param { }
 * @return: { }
 */
export function getFeed(id) {
  return request({
    url: `/datalake-feed_/v1/feedmgr/categories/${id}/feeds`,
    method: 'get'
  })
}
/**
 * @description: 获取流程详情
 * @param { }
 * @return: { }
 */
export function getFeedDetail(id) {
  return request({
    url: `/datalake-feed_/v1/feedmgr/feeds/${id}`,
    method: 'get'
  })
}
/**
 * @description: 获取流程详情
 * @param { }
 * @return: { }
 */
export function delFeed(id) {
  return request({
    url: `/datalake-feed_/v1/feedmgr/feeds/${id}`,
    method: 'delete'
  })
}
/**
 * @description: 获取流程版本信息
 * @param { }
 * @return: { }
 */
export function getFeedVersion(id) {
  return request({
    url: `datalake-feed_/v1/feedmgr/categories/${id}/child`,
    method: 'get'
  })
}
/**
 * @description: 获取流程版本详情
 * @param { }
 * @return: { }
 */
export function getVersionDetail(id) {
  return request({
    url: `/datalake-feed_/v1/feedmgr/feeds/by-name/${id}`,
    method: 'get'
  })
}
// 获取所有数据源
export function getDataSourceList() {
  return request({
    url: '/curd_/DsgDatasource/all',
    method: 'get'
  })
}