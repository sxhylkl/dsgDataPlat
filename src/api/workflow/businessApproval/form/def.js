import request from '@/utils/request'
// import url from 'static/baseurl/index'

const agile = url.agile

/* 业务表单 */

// 获取业务表单列表
export function getDefList(obj) {
  return request({
    url: agile + '/form/formDef/listJson',
    method: 'post',
    data: obj
  })
}

// 树形 treeKey: (bdfl)(固定值,Form Data)
export function getTree(obj) {
  return request({
    url: agile + '/sys/sysTreeNode/getNodes',
    method: 'post',
    data: obj
  })
}

// 获取业务对象信息id
export function getDefInfo(obj) {
  return request({
    url: agile + '/form/formDef/getObject',
    method: 'post',
    params: obj
  })
}

// 获取业务对象字段信息、加载boTree,{boKey: rtryq(业务对象别名)}-form-data
export function getBoTree(obj) {
  return request({
    url: agile + '/form/formDef/boTreeData',
    method: 'post',
    params: obj
  })
}

// 获取业务对象列表(Form Data)
export function getObjectList(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_busObjectSelect',
    method: 'post',
    data: obj
  })
}

// 删除/form/formDef/remove
export function delFormDef(obj) {
  return request({
    url: agile + '/form/formDef/remove',
    method: 'post',
    params: obj
  })
}

// 保存
export function saveFromDef(obj) {
  return request({
    url: agile + '/form/formDef/save',
    method: 'post',
    data: obj
  })
}

// 获取对象信息boKeys
export function getBo (obj) {
  return request({
    url: agile + '/bus/businessPermission/getBo',
    method: 'post',
    data: obj
  })
}

// 获取业务表单的详细信息objType: form,objVal: ywdx1
export function getObjectInfo(obj) {
  return request({
    url: agile + '/bus/businessPermission/getObject',
    method: 'post',
    params: obj
  })
}

// 获取组织
export function getOrg(obj) {
  return request({
    url: agile + '/form/formCustDialog/treeData_orgSelector',
    method: 'post',
    data: obj
  })
}

// 获取岗位
export function getPost(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_postSelector',
    method: 'post',
    data: obj
  })
}

// 获取角色
export function getRole(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_roleSelector',
    method: 'post',
    data: obj
  })
}

// 获取用户
export function getUser(obj) {
  return request({
    url: agile + '/form/formCustDialog/listData_userSelector',
    method: 'post',
    data: obj
  })
}

// 权限配置的保存
export function savePermission(obj) {
  return request({
    url: agile + '/bus/businessPermission/save',
    method: 'post',
    data: obj
  })
}
// 获取业务对象列表(form-data)
export function getListObj(url, obj) {
  return request({
    url: agile + '/form/formDefData/getList_'+url,
    method: 'post',
    data: obj
  })
}
// 获取业务对象的详细信息(key: SchoolStudent,fill: true)
export function getBusObject(obj) {
  return request({
    url: agile + '/bus/businessObject/getObject',
    method: 'post',
    params: obj
  })
}
// 业务表单对象的新增
export function getData(obj) {
  return request({
    url: agile + '/form/formDefData/getData',
    method: 'post',
    params: obj
  })
}

// 保存业务对象的编辑key
export function saveBusObj(key, obj) {
  return request({
    url: agile + '/form/formDefData/saveData?key=' + key,
    method: 'post',
    data: obj
  })
}

// 删除业务对象
export function delBusObj(key, id) {
  return request({
    url: agile + '/form/formDefData/removeData/' + key + '/' + id,
    method: 'post'
  })
}

// 获取模板的数据 boKey=LeaveApplicationObj&type=pc
export function templateData(obj) {
  return request({
    url: agile + '/form/formDef/templateData',
    method: 'post',
    params: obj
  })
}

// 创建html?boKey=LeaveApplicationObj
export function createHtml(key, obj) {
  return request({
    url: agile + '/form/formDef/createHtml?boKey=' + key,
    method: 'post',
    data: obj
  })
}
