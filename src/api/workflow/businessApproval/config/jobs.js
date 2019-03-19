/**
 * Created by suge on 2018/12/13
 */
/**
 * Created by suge on 2018/12/12
 */
import axios from 'axios';
import qs from 'qs';
import request from '@/utils/request'
import {api_url,dataLake_feed} from 'static/baseurl'
var instance2 = axios.create({
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
var instance3 = axios.create({
  headers: {'Content-Type': 'text/html'}
});
//获取所有定时计划
export const list = params => {return instance2.post(`/dsg-bpm/sys/scheduleJob/list`,qs.stringify(params))};
//修改定时计划
export const edit = params => {return request.post(`/dsg-bpm/sys/scheduleJob/edit`,params)};
//获取运行记录
export const logList = params => {return instance2.post(`/dsg-bpm/sys/scheduleJob/log/list?jobId=${params.id}`,qs.stringify(params.content))};
//立即运行
export const run = params => {return request.post(`/dsg-bpm/sys/scheduleJob/runOnce?id=${params.id}`,params)};
//删除
export const remove = params => {return request.post(`/dsg-bpm/sys/scheduleJob/remove?id=${params}`)};
//启动或者停止
export const enable = params => {return request.post(`/dsg-bpm/sys/scheduleJob/enable?id=${params.id}&enable=${params.status}`)};
//获取失败信息的日志详情
export const logDetails = params => {return instance2.post(`/dsg-bpm/sys/scheduleJob/log/detail?id=${params}`,params)};
