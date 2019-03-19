import request from '@/utils/request'
/**
 * @description: 新增部门
 */
export function add(obj) {
  return request({
    url: '/curd_/Department',
    method: 'post',
    data: obj
  })
}
/**
 * @description: 更新部门
 */
export function update(obj) {
  return request({
    url: `/curd_/Department/${obj.id}`,
    method: 'put',
    data: obj
  })
}
/**
 * @description: 删除部门
 */
export function del(id) {
  return request({
    url: `/curd_/Department/${id}`,
    method: 'delete'
  })
}
// 获取部门节点信息 /depart/{Nodeuuid}/deptRelation
export function getDepartInfo(id) {
  return request({
    url: `/curd_/Department/${id}/all`,
    method: 'get'
  })
}
/**
 * @description: 最新10条
 */
export function getDepartTop(num) {
  return request({
    url: `/curd_/Department/top/${num}`,
    method: 'get'
  })
}