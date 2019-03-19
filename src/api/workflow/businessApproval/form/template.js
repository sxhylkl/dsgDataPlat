import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

/* 业务模板 */

// 获取模板列表
export function getTemplateList(obj) {
  return request({
    url: agile + '/form/formTemplate/listJson',
    method: 'post',
    data: obj
  })
}

// 初始化模板
export function initTemplate(obj) {
  return request({
    url: agile + '/form/formTemplate/initTemplate',
    method: 'post',
    data: obj
  })
}

// 获取模板的分类 form data
export function getTemplateType(obj) {
  return request({
    url: agile + '/sys/tools/getEnum',
    method: 'post',
    data: obj
  })
}

// 保存(新增和编辑)
export function saveTemplate(obj) {
  return request({
    url: agile + '/form/formTemplate/save',
    method: 'post',
    data: obj
  })
}

// 获取模板的详细信息
export function getTemplateInfo(obj) {
  return request({
    url: agile + '/form/formTemplate/getObject',
    method: 'post',
    params: obj
  })
}

// 删除
export function delTemplate(obj) {
  return request({
    url: agile + '/form/formTemplate/remove',
    method: 'post',
    params: obj
  })
}
