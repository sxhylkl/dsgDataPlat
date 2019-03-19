import request from '@/utils/request'
// 标准治理
// 新增标准
export function addStandard (obj) {
  return request({
    url: '/curd_/StandardTable',
    method: 'post',
    data: obj
  })
}
// 更新标准
export function updateStandard (obj) {
  return request({
    url: `/curd_/StandardTable/${obj.id}`,
    method: 'put',
    data: obj
  })
}
// 移除标准
export function delStandard (id) {
  return request({
    url: `/curd_/StandardTable/${id}`,
    method: 'delete'
  })
}
// 获取标准列表
export function getStandard (id) {
  return request({
    url: `/curd_/StandardTable/${id}/all`,
    method: 'get'
  })
}
// 最近10
export function getTop (type) {
  return request({
    url: `/curd_/StandardTable/${type}/top/10`,
    method: 'get'
  })
}
// 字段操作
// 获取标准列表详情
export function getStandarFields (id) {
  return request({
    url: `/curd_/DsgStandardField/${id}/all`,
    method: 'get'
  })
}
// 保存新增的字段
export function saveFields (obj) {
  return request({
    url: '/curd_/DsgStandardField/add',
    method: 'post',
    data: obj
  })
}
// 编辑新增的字段
export function updateFields (obj) {
  return request({
    url: `/curd_/DsgStandardField/update/${obj.id}`,
    method: 'put',
    data: obj
  })
}
// 删除字段
export function delFields (id) {
  return request({
    url: `/curd_/DsgStandardField/${id}`,
    method: 'delete'
  })
}
// 获取字段类型
export function getFieldType () {
  return request({
    url: `/curd_/DsgStandardField/type`,
    method: 'get'
  })
}
