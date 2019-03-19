/**
 * Created by suge on 2018/11/15
 */
import axios from 'axios';
import qs from 'qs';
import request from '../../utils/request'
import { api_url, dataLake_feed } from 'static/baseurl'

/*表单管理*/

var instance = axios.create({
    headers: { 'content-type': 'application/json' }
});
var instance2 = axios.create({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
//基础搜索
export const seachUsingBasic = params => { return request.post(`/api_/search/basic`, params) };
//
export const typedefs = params => { return request.get(`/api_/types/typedefs`, { params: params }) };
//删除标签
export const deleteTag = params => { return request.delete(`/api_/entity/guid/${params.guid}/classification/${params.tagName}`) };
//添加标签
export const addTag = params => { return request.post(`/api_/entity/bulk/classification`, JSON.stringify(params)) };
//术语参数剥离
export const spliceTerm = params => {
    let arr = [];
    for (let key in params) {
        if (params[key].guid === '350cdd29-6b90-4dbe-94f0-e45d2605701c') {
            params.splice(key, 1)
            return params
        }
        else {
            arr.push(params[key])
        }
    }
    return arr
}
export const spliceTerm2 = params => {
    let data = []
    for (let key in params) {
        if (params[key].guid === '350cdd29-6b90-4dbe-94f0-e45d2605701c') {
            data.push(params[key])
            return data
        }
    }
    return data
}
// 获取术语列表
export const getTerm = params => { return request.get(`/api_/glossary`, { params: params }) };
// 将给定的术语分配给提供的实体标题列表
export const addTerm = params => { return request.post(`/api_/glossary/terms/${params.pguid}/assignedEntities`, params.guid) };
// 删除给定实体的指定术语
export const deleteTerm = params => { return request.delete(`/api_/glossary/terms/${params.termid}/assignedEntities`, { data: JSON.stringify(params.guid) }) };


// 获取首页展示右方滚动表格数据
export const getMainTable = params => { return request.get(`/api_/entity/update/all`, { params: params }) };
// 获取首页左方柱状图数据
export const getMainChart = params => { return request.get(`/api_/entity/update/quantityStatistics`, { params: params }) };


// 数据详情页面获取实体信息
export const getEntityDetails = params => { return request.get(`/api_/entity/guid/${params}`) };
// 数据详情页面获取审计信息
export const getAuditDetails = params => { return request.get(`/api_/entity/${params.guid}/audit?count=${params.count}`) };
// 数据详情页面获取血统信息
export const lineage = params => { return request.get(`/api_/lineage/${params}`) };
// 数据详情页面编辑标签
export const editTag = params => { return request.put(`/api_/entity/guid/${params.entityGuid}/classifications`, JSON.stringify([params.main])) };


// 标签管理页面添加属性接口
export const addAttributes = params => { return request.put(`/api_/types/typedefs?type=classification`, JSON.stringify(params)) };
// 创建一个新的标签
export const createTag = params => { return request.post(`/api_/types/typedefs?type=classification`, JSON.stringify(params)) };
// 删除标签
export const DeleteTag = params => { return request.delete(`/api_/types/typedefs?type=classification`, { data: JSON.stringify(params) }) };


// 业务管理页面某一个业务详情获取
export const getTermDetails = params => { return request.get(`/api_/glossary/term/${params}`) };
// 术语分类
export const putTerm = params => { return request.put(`/api_/glossary/term/${params.guid}`, JSON.stringify(params)) };
// 为glossary创建项目
export const postTerm = params => { return request.post(`/api_/glossary/term`, JSON.stringify(params)) };
// 为glossary删除项目
export const deleteTerm_ = params => { return request.delete(`/api_/glossary/term/${params}`) };
// 业务页面术语树状图关系获取
export const getRelation = params => { return request.get(`/api_/glossary/category/${params}/related`) };
// glossay修改
export const putGlossary = params => { return request.put(`/api_/glossary/${params.guid}`, JSON.stringify(params)) };
// glossay创建
export const createGlossary = params => { return request.post(`/api_/glossary`, JSON.stringify(params)) };
// glossay删除
export const deleteGlossary = params => { return request.delete(`/api_/glossary/${params}`) };
// 创建类别/glossary/category
export const creatCategory = params => { return request.post(`/api_/glossary/category`, JSON.stringify(params)) };
// 获取category详细信息
export const getCategory = params => { return request.get(`/api_/glossary/category/${params}`) };
// 修改category信息
export const putCategory = params => { return request.put(`/api_/glossary/category/${params.guid}`, JSON.stringify(params)) };
// 删除category
export const deleteCategory = params => { return request.delete(`/api_/glossary/category/${params}`) };



// demo数据资产地图
export const demo = params => { return request.get(`/api_/glossary/getDataAssetsMap/${params}`) };

// 标准维护中创建新的实体
export const createEntity = params => { return request.post(`/api_/entity/create/entity/${params.id}`, JSON.stringify(params.content)) };

// 获取消息通讯配置信息
export const getPz = params => { return request.get(`/api_/entity/selectConfigurationEntity?limit=${params.limit}&offset=${params.offset}&type=${params.type}`) }
// 获取数据配置
export const getPz2 = params => { return request.get(`/api_/entity/selectConfigurationEntity?limit=${params.limit}&offset=${params.offset}`) }
// 修改配置
export const changePz = params => { return request.post(`/api_/entity/updateConfigurationEntity`, JSON.stringify(params)) }


// 新的标准
export const getTree = params => { return request.get(`/api_/standardMenu/getTree`) }

/*
export const getSTable = params => {return instance.get(`/api_/standardTable/list?limit=${params.limit}&offset=${params.offset}&standardNameId=${params.standardNameId}`)}
*/

export const getSTable = params => { return request.get(`/api_/standardMenu/getStandard?standard_name_id=${params.standardNameId}&limit=${params.limit}&offset=${params.offset}`) }

export const saveOrUpdate = params => { return request.post(`/api_/standardMenu/saveorupdate?parentId=${params.parentId}&standardName=${params.standardName}`, JSON.stringify(params)) }

export const OrUpdate = params => { return request.post(`/api_/standardMenu/saveorupdate?parentId=${params.parentId}&standardName=${params.standardName}&id=${params.id}`, JSON.stringify(params)) }

export const remove = params => { return request.post(`/api_/standardMenu/remove?id=${params.id}`, JSON.stringify(params)) }

export const saveOrUpdate2 = params => { return request.post(`/api_/standardTable/saveorupdate`, qs.stringify(params)) }

export const remove2 = params => { return request.post(`/api_/standardTable/remove`, qs.stringify(params)) }
//standardColumns/saveorupdate
export const saveorupdate = params => { return request.post(`/api_/standardColumns/saveorupdate`, qs.stringify(params)) }

export const remove3 = params => { return request.post(`/api_/standardColumns/remove`, qs.stringify(params)) }

// 数据字典

export const SelectDateDictionaryType = params => { return request.get(`/api_/dateDictionary/SelectDateDictionaryType`) }

export const AddOrUpdateDateDictionaryType = params => { return request.post(`/api_/dateDictionary/AddOrUpdateDateDictionaryType`, qs.stringify(params)) }

export const DeleteDateDictionaryType = params => { return request.post(`/api_/dateDictionary/DeleteDateDictionaryType`, qs.stringify(params)) }

export const selectDateDictionaryDetails = params => { return request.get(`/api_/dateDictionary/selectDateDictionaryDetails`, { params: params }) }

export const AddOrUpdateDateDictionaryDetails = params => { return request.post(`/api_/dateDictionary/AddOrUpdateDateDictionaryDetails`, qs.stringify(params)) }

export const DeleteDateDictionaryDetails = params => { return request.post(`/api_/dateDictionary/DeleteDateDictionaryDetails`, qs.stringify(params)) }

// 编码标准
export const codingRuleList = params => { return request.get(`/api_/codingRule/list`, { params }) }

export const codingRuleSaveOrUpdate = params => { return request.post(`/api_/codingRule/saveOrUpdate`, qs.stringify(params)) }

export const codingRuleRemove = params => { return request.post(`/api_/codingRule/remove`, qs.stringify(params)) }

// 数据源管理
export const datasourceList = params => { return request.get(`/api_/datasource/list`, { params: params }) }

export const datasourceSaveorupdate = params => { return request.post(`/api_/datasource/saveOrUpdate`, qs.stringify(params)) }

export const datasourceRemove = params => { return request.post(`/api_/datasource/remove`, qs.stringify(params)) }

// 业务治理datalakeGovernanceTask/remove
export const getTree2 = params => { return request.get(`/api_/DataDirectory/getTree`) }

export const remove4 = params => { return instance2.post(`/api_/DataDirectory/remove`, qs.stringify(params)) }

export const update = params => { return instance2.post(`/api_/DataDirectory/saveorupdate`, qs.stringify(params)) }

export const getSTable2 = params => { return request.get(`/api_/datalakeGovernanceTask/list?datadirectoryId=${params.standardNameId}&limit=${params.limit}&offset=${params.offset}`) }

export const update2 = params => { return instance2.post(`/api_/datalakeGovernanceTask/saveorupdate`, qs.stringify(params)) }

export const remove5 = params => { return instance2.post(`/api_/datalakeGovernanceTask/remove`, qs.stringify(params)) }

export const linkTree = params => { return request.get(`/api_/standardMenu/getTreeAndStandard`) }
/**
 * @description: 最新10条
 */
export function getTaskTop() {
  return request({
    url: '/api_/datalakeGovernanceTask/top10',
    method: 'get'
  })
}

/**
 * @description: 根据节点获取数据
 */
export function getTaskById(id) {
  return request({
    url: `/api_/datalakeGovernanceTask/${id}/businessRelation`,
    method: 'get'
  })
}

// 链接数据湖部分
export const convert = params => { return instance2.post(`/datalake-feed_/v1/feedmgr/categories/category-convert`, qs.stringify(params)) }

export const category_feeds = params => { return request.get(`/datalake-feed_/v1/feedmgr/categories/category_feeds`, { params: params }) }

// 关联后更新column
export const updateColumn = params => { return request.get(`/datalake-feed_/v1/feedmgr/categories/category_standard`, { params: params }) };


