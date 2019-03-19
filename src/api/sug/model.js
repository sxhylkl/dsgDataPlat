import qs from 'qs';
import request from "../../utils/request";
//新的标准
export const getTree = params => {return request.get(`/api_/modelMenu/getTree`)}
/*
export const getSTable = params => {return instance.get(`/api_/standardTable/list?limit=${params.limit}&offset=${params.offset}&standardNameId=${params.standardNameId}`)}
*/

export const getSTable = params => {return request.get(`/api_/modelMenu/getModel?standard_name_id=${params.standardNameId}&limit=${params.limit}&offset=${params.offset}`)}

export const saveOrUpdate = params => {return request.post(`/api_/modelMenu/saveorupdate?parentId=${params.parentId}&standardName=${params.standardName}`,JSON.stringify(params))}

export const OrUpdate = params => {return request.post(`/api_/modelMenu/saveorupdate?parentId=${params.parentId}&standardName=${params.standardName}&id=${params.id}`,JSON.stringify(params))}

export const remove = params => {return request.post(`/api_/modelMenu/remove?id=${params.id}`,JSON.stringify(params))}

export const saveOrUpdate2 = params => {return request.post(`/api_/modelTable/saveorupdate`,qs.stringify(params))}

export const remove2 = params => {return request.post(`/api_/modelTable/remove`,qs.stringify(params))}
//standardColumns/saveorupdate
export const saveorupdate = params => {return request.post(`/api_/modelColumns/saveorupdate`,qs.stringify(params))}

export const remove3 = params => {return request.post(`/api_/modelColumns/remove`,qs.stringify(params))}

