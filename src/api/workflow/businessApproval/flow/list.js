/**
 * Created by suge on 2018/12/4
 */
import request from '@/utils/request'
/*import url from 'static/baseurl'*/

/*表单管理*/

const agile = url.agile

/*业务对象*/

export function getListJson (obj) {
    return request({
        url: agile + '/bpm/definition/listJson',
        method: 'post',
        params: obj
    })
}
export function getNodes(){
    return request({
        url: agile + '/sys/sysTreeNode/getNodes',
        method: 'get',
        params: {treeKey:'flow',nodeKey:''}
    })
}
export function remove (obj) {
    return request({
        url: agile + '/bpm/definition/remove',
        method: 'get',
        params: obj
    })
}
export function getObject (obj) {
    return request({
        url: agile + `/form/formCustDialog/${obj.type}`,
        method: 'post',
        params: obj.data
    })
}

export function getInstanceData (obj) {
    return request({
        url: agile + `/bpm/instance/getInstanceData`,
        method: 'get',
        params: obj
    })
}

export function getOverallView (obj) {
    return request({
        url: agile + `/bpm/overallView/getOverallView`,
        method: 'post',
        params: obj
    })
}
