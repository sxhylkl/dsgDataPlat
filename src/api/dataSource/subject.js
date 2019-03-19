/**
 * Created by suge on 2018/12/12
 */
import request from '../../utils/request'

/**
 * @description: 最新10条
 */
export function getSubjectTop(num) {
  return request({
    url: `/curd_/Subject/top/${num}`,
    method: 'get'
  })
}
/**
 * @description: 获取流程输出表列表
 */
export function getFeedTable() {
  return request({
    url: ' /curd_/Feed/getFeedTable',
    method: 'get'
  })
}
/**
 * @description: 获取主题列表
 */
export function getSubjecList(id) {
  return request({
    url: `/curd_/Subject/${id}/all`,
    method: 'get'
  })
}
// 新增主题
export function addSubject(obj) {
  return request({
    url: '/curd_/Subject',
    method: 'post',
    data: obj
  })
}
// 更新主题
export function updateSubject(obj) {
  return request({
    url: `/curd_/Subject/${obj.id}`,
    method: 'put',
    data: obj
  })
}
// 更新主题
export function delSubject(id) {
  return request({
    url: `/curd_/Subject/${id}`,
    method: 'delete'
  })
}
// 保存关联
export function addRelationList(obj) {
  return request({
    url: '/curd_/ResRelation/list',
    method: 'post',
    data: obj
  })
}
// 获取关联信息
export function getRelationList(id) {
  return request({
    url: `/curd_/ResRelation/${id}/TABLE/all`,
    method: 'get'
  })
}
/* // 取消关联
export function delRelation(id) {
  return request({
    url: `/curd_/ResRelation/${id}`,
    method: 'delete'
  })
} */