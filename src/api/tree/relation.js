import request from '@/utils/request'

const url = 'http://192.168.23.52:10003'

export const getTab = params => request.get('/curd_/StandarBaseColumn/all');
// 获取行业标准字段详情
export const getStandarBaseColumn = obj => request.get(`/curd_${obj.url}/getByStandaryBaseId/${obj.id}`);
