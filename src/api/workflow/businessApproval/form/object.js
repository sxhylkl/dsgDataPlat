import request from '@/utils/request'
// import url from 'static/baseurl/index'

/* 表单管理 */

const agile = url.agile

/* 业务对象 */

export function getObjectList(obj) {
  return request({
    url: agile + '/bus/businessObject/listJson',
    method: 'post',
    data: obj
  })
}

// 获取业务对象的详细信息{id:}
export function getObjectInfo(obj) {
  return request({
    url: agile + '/bus/businessObject/getObject',
    method: 'post',
    params: obj
  })
}


// 获取所有表信息
export function getObjectTable(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_ywblb',
    method: 'post',
    data: obj
  })
}

// 保存
export function saveObj(obj) {
  return request({
    url: agile + '/bus/businessObject/save',
    method: 'post',
    data: obj
  })
}

// 删除
export function delObj(obj) {
  return request({
    url: agile + '/bus/businessObject/remove',
    method: 'post',
    params: obj
  })
}
