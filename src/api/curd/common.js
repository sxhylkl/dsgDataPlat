import request from '@/utils/request'
/**
 * @description: 解除关系
 */
export function delRelation(id) {
  return request({
    url: `/curd_/DsgResRelation/${id}`,
    method: 'delete'
  })
}
// 保存关联
export function addRelation(obj) {
  return request({
    url: '/curd_/DsgResRelation/list',
    method: 'post',
    data: obj
  })
}
// 获取详细
export function getDetail(obj) {
  return request({
    url: `/curd_/${obj.url}/${obj.id}`,
    method: 'get'
  })
}