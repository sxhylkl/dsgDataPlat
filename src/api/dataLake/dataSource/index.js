import request from '@/utils/request'

// 数据源

// 新增
export function addObj(obj) {
  return request({
    url: '/curd_/DsgDatasource',
    method: 'post',
    data: obj
  })
}
// 更新/api/metadata2/Datasource/{id}
export function updateObj(obj) {
  return request({
    url: '/curd_/DsgDatasource/' + obj.id,
    method: 'put',
    data: obj
  })
}

// 详情
export function detail(id) {
  return request({
    url: '/curd_ /DsgDatasource' + id,
    method: 'get'
  })
}

// 删除
export function delObj(id) {
  return request({
    url: '/curd_/DsgDatasource/' + id,
    method: 'delete'
  })
}

/**
 * 获取最新10条记录
 * @param {*} data any
 */
export function getTop(num) {
  return request({
    url: `/curd_/DsgDatasource/top/${num}`,
    method: 'get'
  })
}
/**
 * 根据树形菜单获取列表
 * @param {*} obj any
 */
export function getListByTree(id) {
  return request({
    url: `/curd_/DsgDatasource/${id}/all`,
    method: 'get'
  })
}
/**
 * 测试数据库是否连通
 * @param {*} obj any
 */
export function testConnect(obj) {
  return request({
    url: '/curd_/DsgDatasource/TestIsConnect',
    method: 'post',
    data: obj
  })
}