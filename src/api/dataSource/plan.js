/**
 * Created by suge on 2018/12/12
 */
import axios from 'axios';
import qs from 'qs';
import request from '../../utils/request'
import {api_url,dataLake_feed} from 'static/baseurl'

var instance = axios.create({
    headers: {'content-type': 'application/json'}
});
var instance2 = axios.create({
    headers: {'Authorization':'Bearer'}
});
//获取所有主题
export const list = params => {return request.post(`/plan_/list`,params)};
