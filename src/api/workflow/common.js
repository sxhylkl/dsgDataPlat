import request from '@/utils/request'

const agile = url.agile

// 弹窗表格

// 获取弹框列表
export function getList (key,obj) {
    return request({
        url: agile + '/form/formCustDialog/listData_'+key,
        method: 'post',
        data: obj
    })
}

// 获取弹窗列名,参数：{key:}
export function getFields (obj) {
    return request({
        url: agile + '/form/formCustDialog/getObject',
        method: 'post',
        params: obj
    })
}

//同意、驳回、保存
export function doAction (obj) {
    return request({
        url: agile + '/bpm/task/doAction',
        method: 'post',
        data: obj
    })
}

//审批历史
export function getApprovalHistory (obj) {
    return request({
        url: agile + '/bpm/instance/getInstanceOpinion',
        method: 'post',
        data: obj
    })
}

//流程图
export function getFlowImage () {
    return agile + '/bpm/instance/flowImage'
}

// 办理历史

//办理历史列表
export function getApprove (obj) {
    return request({
        url: agile + '/bpm/my/approveList',
        method: 'post',
        data: obj
    })
}

//详情
export function getApproveDetail (query) {
    return request({
        url: agile + '/bpm/instance/getInstanceData',
        method: 'get',
        params: query
    })
}
