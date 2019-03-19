import request from '@/utils/request'
// import url from 'static/baseurl/index'

/* 表单管理 */

const agile = url.agile

/* 业务实体 */

// 列表order: asc,offset: 0 ,limit: 10,name_^VLK:'实体名'（Form Data)
export function getTableList(obj) {
  return request({
    url: agile + '/bus/businessTable/listJson',
    method: 'post',
    data: obj
  })
}

// 保存（编辑、新增）
export function saveTable(obj) {
  return request({
    url: agile + '/bus/businessTable/save',
    method: 'post',
    data: obj
  })
}

// 生成表
export function createTable(obj) {
  return request({
    url: agile + '/bus/businessTable/createTable',
    method: 'post',
    data: obj
  })
}

// 获取数据源
export function getDataSource(obj) {
  return request({
    url: agile + '/sys/sysDataSource/listJson',
    method: 'post',
    data: obj
  })
}

// 获取当前业务实体的数据
export function getObjectInfo(obj) {
  return request({
    url: agile + '/bus/businessTable/getObject',
    method: 'post',
    params: obj
  })
}

// 获取数据字段
export function getDic() {
  return request({
    url: agile + '/sys/dataDict/getDictTree',
    method: 'post'
  })
}

// 删除
export function tableDel(obj) {
  return request({
    url: agile + '/bus/businessTable/remove',
    method: 'post',
    params: obj
  })
}

// 查询数据表名
// dsKey: "dataSourceDefault"
// objName: "123"
// objType: "table"
export function getObjTable(obj) {
  return request({
    url: agile + '/form/formCustDialog/searchObjName',
    method: 'post',
    data: obj
  })
}

// 表的详细信息
export function getObjTableInfo(obj) {
  return request({
    url: agile + '/form/formCustDialog/getTable',
    method: 'post',
    data: obj
  })
}

// 共用的接口

// 树形 treeKey: (业务实体ywbfl)(固定值,Form Data),(业务对象ywdxfl)
export function getTree(obj) {
  return request({
    url: agile + '/sys/sysTreeNode/getNodes',
    method: 'post',
    data: obj
  })
}

// 获取数据类型和字段控件
export function getEnum(obj) {
  return request({
    url: agile + '/sys/tools/getEnum',
    method: 'post',
    data: obj
  })
}

