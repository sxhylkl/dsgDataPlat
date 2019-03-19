import axios from 'axios';
import qs from 'qs';
import request from '../../utils/request'
import {
  dataLake
} from 'static/baseurl'
const instance = axios.create({
  headers: {
    'content-type': 'application/json'
  }
});
const instance2 = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
const instance3 = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// 数据质量
export const getDataQualityList = feedId => request.get(`/datalake-feed_/v1/feedmgr/feeds/${feedId}/profile-summary-job-count`) // 获取数据质量列表
// export const getDataQualityList = feedId => request.get(`/datalake-feed_/v1/feedmgr/feeds/${feedId}/profile-summary`) // 获取数据质量列表
export const getDataQualityDetail = params => request.get(`/datalake-feed_/v1/feedmgr/feeds/${params.feedId}/profile-stats?processingdttm=${params.processing_dttm}`) // 获取数据质量详情
export const getDataQualityValid = params => request.get(`/datalake-feed_/v1/feedmgr/feeds/${params.feedId}/profile-valid-results?limit=${params.limit}&processingdttm=${params.processing_dttm}`) // 获取数据质量有效
export const getDataQualityInvalid = params => request.get(`/datalake-feed_/v1/feedmgr/feeds/${params.feedId}/profile-invalid-results?filter=${params.filter}&limit=${params.limit}&processingdttm=${params.processing_dttm}`) // 获取数据质量无效

// 任务管理
export const getCategoryList = () => request.get('/datalake-feed_/v1/feedmgr/categories') // 获取分类列表
export const getCategoryDetail = id => request.get(`/datalake-feed_/v1/feedmgr/categories/by-id/${id}`) // 获取分类详情
export const delCategory = id => request.delete(`/datalake-feed_/v1/feedmgr/categories/${id}`) // 删除分类
export const editCategory = params => request.post('/datalake-feed_/v1/feedmgr/categories', params) // 创建编辑分类
export const getCategorySystemName = name => request.get(`/datalake-feed_/v1/feedmgr/util/system-name?name=${name}`) // 创建编辑分类
export const getDataSource = () => request.get('/subject_/v1/metadata/datasource/msg/all') // 查询数据源列表
export const getTaskTree = () => request.get('/subject_/task/tree') // 获取任务树
export const getTaskNum = num => request.get(`/subject_/task/record/${num}`) // 最近更新的任务列表（10条）
export const addOrEditTask = params => request.post(`/subject_/task/saveOrUpdate`, params) // 新建/编辑任务
export const removeTask = id => request.delete(`/subject_/task/remove/${id}`) // 删除任务
export const getFeedsListById = id => request.get(`/datalake-feed_/v1/feedmgr/categories/${id}/feeds`);// 点击任务获取流程列表
export const getTaskDetails = id => request.get(`/subject_/task/getTask/${id}`);// 获取任务详情
export const getTaskRelationDetails = id => request.get(`/subject_/task-summary/${id}`);// 获取任务关联详情


// 首页报表(1期)
export const getTemplatesInfo = () => request.get('/datalake-agent_/v1/feedmgr/templates/stats') // 获取模板统计信息
export const getTemplatesAlarm = () => request.get('/datalake-agent_/v1/dashboard') // 获取模板告警信息
// export const getFeedCount = () => request.get('/datalake-feed_/v1/feedmgr/feeds/feedCount') // 获取流程统计信息
export const getDataCount = () => request.get('/subject_/subject/count') // 获取数据主题总数
// export const getTaskCount = () => request.get('/api_/datalakeGovernanceTask/countAll') // 获取任务总数
export const getDepartmentCount = () => request.get('/api/admin/depart/deptStat') // 获取任务总数

// 首页报表(2期)
export const getDepartCount = params => request.get('/api/admin/depart/deptStat') // 获取所有部门总数
export const getDepartDeptSummary = params => request.get('/api/admin/depart/dept-summary') // 获取所有部门关联业务、主题、标准数据个数
export const getDepartDeptDataSummary = params => request.get('/api/admin/depart/dept-data-summary') // 获取部门关联任务流程的所有表的数据量总大小与总条数
export const getDepartDeptTaskSummary = params => request.get('/api/admin/depart/dept-task-summary') // 	统计所有部门处理数据状态为失败的流程/job数
export const getTaskCount = params => request.get('/datalake-feed_/v1/feedmgr/categories/count') // 统计所有任务总的个数
export const getTaskFeedSummary = params => request.get('/datalake-feed_/v1/feedmgr/categories/feedSummary') // 统计所有任务中没有流程的任务个数,统计所有任务中有流程正在运行的任务个数
export const getThemeCount = params => request.get('/subject_/subject/count') // 统计所有主题总的个数
export const getThemeTableSummary = params => request.get('/subject_/subject/tableSummary') // 统计所有主题下表的总的个数（各种表）、数据总量大小和条数
export const getFeedCount = params => request.get('/datalake-feed_/v1/feedmgr/feeds/feedCount') // 获取流程统计信息
export const getFeedStatus = params => request.get('/datalake-feed_/v1/feedmgr/feeds/jobstatus/feedCount') // 统计所有运行正常/失败个数
export const getFeedType = params => request.get('/datalake-feed_/v1/feedmgr/feeds/by-type/feedCount') // 统计所有采集/转换
export const getStandardCount = params => request.get('/api_/standardTable/count') // 统计所有标准的总个数
export const getStandardTableSummary = params => request.get('/api_/standardTable/tableSummary') // 统计所有标准下标准表的总个数/字段个数/数据总量大小/条数
export const getBusinessCount = params => request.get('/api_/datalakeGovernanceTask/countAll') // 统计所有业务系统总个数
export const getBusinessTableSummary = params => request.get('/api_/datalakeGovernanceTask/tableSummary') // 所有业务表的数据总量大小和条数
export const getDataSourceCount = params => request.get('/subject_/v1/metadata/datasource/classify/count') // 统计源端数据源的类型的个数
export const getDataSourceSummary = params => request.get('/subject_/v1/metadata/datasource/msg/dataSourceSummary') // 统计源端已登记的源端信息个数/服务正常/异常/数据源采集的数据量
export const getRulesCount = params => request.get('/api_/rule/summaryAll') // 统计源端已登记的源端信息个数/服务正常/异常/数据源采集的数据量
//首页报表(3期)
export const getDashBoard = params => request.get(`/api/metadata2/statistics/statistics?start=${params}&end=${params}`) // 统计源端已登记的源端信息个数/服务正常/异常/数据源采集的数据量
//http://192.168.23.225:8767/api/metadata2/statistics/scheduling 调用脚本获取最新数据
export const getRecentData = params => request.get(`/api/metadata2/statistics/scheduling`) // 统计源端已登记的源端信息个数/服务正常/异常/数据源采集的数据量
/* feedmgr/templates/registered/1fd40280-bc73-4e9e-88ea-a5fbc54d2705?allProperties=true&feedEdit=true*/
export const getAllTemplates = () => request.get('/datalake-agent_/v1/feedmgr/templates')
export const getRegistered = params => request.get(`/datalake-agent_/v1/feedmgr/templates/registered/${params.id}?allProperties=true&templateName=+${params.name}`)
export const getRoleGroup = () => request.get('/datalake-agent_/v1/security/groups');

// 模板
/* feedmgr/templates/registered/1fd40280-bc73-4e9e-88ea-a5fbc54d2705?allProperties=true&feedEdit=true*/
export const getTemplates = () => request.get('/datalake-agent_/v1/feedmgr/templates/registered');
export const exportTemplate = params => request.get(`/datalake-agent_/v1/feedmgr/admin/export-template/${params}`);
/* export const importTemplate = params => request.post('/datalake-agent_/v1/feedmgr/admin/import-template', params);*/
export const importTemplate = params => request.post('/datalake-agent_/v2/feedmgr/admin/import-template', params);
export const templateRegister = params => request.post('/datalake-agent_/v1/feedmgr/templates/register', params)
export const templateEnable = params => request.post(`/datalake-agent_/v1/feedmgr/templates/registered/${params.id}/${params.state}`) // state: disable enabel
export const getReusableInput = () => request.get('/datalake-feed_/v1/feedmgr/nifi/reusable-input-ports');


/* DELETE /v1/feedmgr/templates/registered/{templateId}/delete*/
export const delTemplate = params => request.delete(`/datalake-agent_/v1/feedmgr/templates/registered/${params}/delete`);

// 流程
export const getFeedsList = params => request.get(`/datalake-feed_/v1/feedmgr/feeds?${params}`);
// 删除流程 DELETE /v1/feedmgr/feeds/{feedId}
export const delFeed = params => request.delete(`/datalake-feed_/v1/feedmgr/feeds/${params}`);

// 导入流程中需要获取分类列表 http://192.168.23.125:8400/proxy/v1/feedmgr/categories
export const getCategories = params => request.get('/datalake-feed_/v1/feedmgr/categories');
// 从模板中导入流程需要获取模板列表 GET /v1/feedmgr/templates/registered
export const getRegisteredTemplate = params => request.get('/datalake-agent_/v1/feedmgr/templates/registered');
// 获取所有属性
export const getRegisteredTemplateAllProperty = params => instance3.get(`/datalake-agent_/v1/feedmgr/templates/registered/${params}?allProperties=true&feedEdit=true`);
// 流程上传文件v1/schema-discovery/hive/sample-file
export const uploadFile = params => request.post('/datalake-feed_/v1/schema-discovery/hive/sample-file', params);
// 上传文件需要的参数 schema-discovery/file-parsers
export const getSchemaParser = params => request.get('/datalake-feed_/v1/schema-discovery/file-parsers');













/** **************************** made by suge *******************************/
// 可视化查询部分

// 获取具体类型的数据库http://192.168.23.125:8400/proxy/v1/metadata/datasource?type=UserDatasource
export const getUserDatasource = () => request.get('/datalake-feed_/v1/metadata/datasource?type=UserDatasource');
// 查询数据库的表列表hive/tables
export const getHiveTables = () => request.get('/datalake-feed_/v1/hive/tables');
// 获取具体某张表的信息 对应添加表操作 http://192.168.23.125:8400/proxy/v1/hive/schemas/baseinfo/tables/tbl_baseinfo
export const baseInfo = params => request.get(`/datalake-feed_/v1/hive/schemas/${params.one}/tables/${params.two}`);
// 获取sql查询出来的信息proxy/v1/spark/shell/transform
export const transform = params => request.post('/datalake-agent_/v1/spark/shell/transform', params);
// http://192.168.23.125:8400/proxy/v1/spark/shell/transform/ad63c3ae82374d729ef66a7973918c09
export const transform2 = params => request.get(`/datalake-agent_/v1/spark/shell/transform/${params}`);
// 添加hive表结构
export const datasource = params => request.get(`/datalake-feed_/v1/metadata/datasource/${params.id}/tables?tableName=${params.name}`);
// 添加非hive表结构方法
export const datasourceTable = params => request.get(`/datalake-feed_/v1/metadata/datasource/${params.id}/tables/${params.tableName}?schema=${params.schema}`);
// 服务service-monitor/
export const serviceMonitor = () => request.get('/datalake-agent_/monitor/monitorService');
// 根据id获取数据源详情
export const getDataSourceById = (id) => request.get(`/datalake-feed_/v1/metadata/datasource/${id}`);
//获取hive所有的数据库名
export const getSchemasName = () => request.get(`/datalake-feed_/v1/hive/schemas`);
//获取某个数据库的所有表
export const getAllTablesFS = params => request.get(`/datalake-feed_/v1/hive/schemas/${params}/tables`);
//获取script脚本信息
export const getScripts = params => request.post(`/datalake-agent_/v1/spark/shell/transform/fromScriptInfoV2`,params);
// export const getDataSourceById = (id) => request.get(`/curd_/Datasource/${id}`); 王永亮的



// 作业http://192.168.23.125:8400/proxy/v1/jobs/
// export const jobs = (params) =>{return request.get(`/dataLake_/jobs/`,{params:params})};
export const jobs = params => request.get(`/datalake-feed_/v1/jobs/${params.type}`, { params: params.content });
// 失败操作 http://192.168.23.125:8400/proxy/v1/jobs/11667/fail
export const fail = params => request.post(`/datalake-feed_/v1/jobs/${params}/fail`, {});
// 遗弃操作http://192.168.23.125:8400/proxy/v1/jobs/16224/abandon
export const abandon = params => request.post(`/datalake-feed_/v1/jobs/${params}/abandon`, {});
// 点击单行作业进入该行详情http://192.168.23.125:8400/proxy/v1/jobs/16218?includeSteps=true
export const includeSteps = params => request.get(`/datalake-feed_/v1/jobs/${params}?includeSteps=true`);


// 告警部分
// 列表展示http://192.168.23.125:8400/proxy/v1/alerts
export const alerts = params => request.get('/datalake-agent_/v1/alerts', {
  params
});
// 获取某个告警的信息详情http://192.168.23.125:8400/proxy/v1/alerts?cleared=false&limit=5&state=UNHANDLED
export const alertsDe = params => request.get(`/datalake-agent_/v1/alerts/${params}`);
// 修改告警信息操作http://192.168.23.125:8400/proxy/v1/alerts/f3a3b438-9a92-4c49-a0f6-73900c510b74:885917627
export const alertsPo = params => request.post(`/datalake-agent_/v1/alerts/${params.id}`, params.data);


/** **************************** made by suge *******************************/

/** **************************** 数据查询 *******************************/
// 获取表明列表http://192.168.23.125:8400/proxy/v1/hive/tables
export const getTableName = params => request.get('/datalakeFeed/tables', {
  params
})
export const getColumsInfo = params => request.get(`/datalakeFeed/table-columns?databaseName=${params.pattern}&&tableName${params.name}`)
export const getSchemas = params => request.get(`/datalakeFeed/schemas/${params.pattern}/tables/${params.name}`)


/** **************版本管理****************/
// GET /v1/feedmgr/categories/by-name/{categorySystemName}
export const getTemplateOne = params => request.get(`/datalake-agent_/v1/feedmgr/templates/registered/${params}?allProperties=true&feedEdit=true`);

export const getCategoriesForVersion = params => request.get(`/datalake-feed_/v1/feedmgr/categories/by-name/${params}`);

// POST /v1/feedmgr/categories/create/prod
/** **第一次创建prod时只传parent，第二次需要name***/
export const postProdVersion = params => request.post('/datalake-feed_/v1/feedmgr/categories/create/prod', params);

/* GET /v1/feedmgr/categories/{categoryId}/child*/
export const postProdVersionChild = params => request.get(`/datalake-feed_/v1/feedmgr/categories/${params}/child`);
// 标准
export const getFeedValidation = params => request.get('/datalake-feed_/v1/field-policies/validation');

export const getFeedStandardization = params => request.get('/datalake-feed_/v1/field-policies/standardization');

// 获取数据转换id feedmgr/templates/transformTemplateId
export const getTransformTemplateId = params => instance2.get('/datalake-agent_/v1/feedmgr/templates/transformTemplateId');

/** ************************************************************流程部分**************************************************************/
export const saveFeed = params => request.post('/datalake-feed_/v1/feedmgr/feeds', params);
// 创建测试流程 feedmgr/categories/create/test
export const createTestFeed = params => request.post('/datalake-feed_/v1/feedmgr/categories/create/test', params);
// 查找标准流程GET /v1/feedmgr/feeds/by-name/{feedName}
export const getStandarFeed = params => request.get(`/datalake-feed_/v1/feedmgr/feeds/by-name/${params}`);


// 禁用流程
export const disabledFeed = params => request.post(`/datalake-feed_/v1/feedmgr/feeds/disable/${params}`);
// 启用流程
export const enableFeed = params => request.post(`/datalake-feed_/v1/feedmgr/feeds/enable/${params}`);

// 导入流程
export const importFeed = params => instance3.post('/datalake-feed_/v2/feedmgr/admin/import-feed', params);


// 获取流程详情 GET /v1/feedmgr/feeds/{feedId}
export const getFeedDetail = params => request.get(`/datalake-feed_/v1/feedmgr/feeds/${params}`);
// POST /v1/feedmgr/feeds/{feedId}/merge-template
// export const getFeedDetailMerge = params =>{return request.post(`/dataLake/feedmgr/feeds/${params}`)};

// nifi/controller-services
export const getFeedController = params => request.get(`/datalake-feed_/v1/feedmgr/nifi/controller-services/${params}`);


// 删除流程 DELETE /v1/feedmgr/feeds/{feedId}

// 获取 dataBase信息 nifi/controller-services/process-group/root
export const getDataBaseArr = params => request.get(`/datalake-feed_/v1/feedmgr/nifi/controller-services/process-group/root?type=${params}`);
/* GET /v1/feedmgr/nifi/controller-services/{serviceId}/tables/{tableName}*/
export const getTbaleName = params => request.get(`/datalake-feed_/v1/feedmgr/nifi/controller-services/${params.value}/tables/${params.tableName}?serviceName=${params.serviceName}&schema=${params.schema}`);
/* feedmgr/nifi/controller-services/3336da65-0162-1000-07b8-58f471132db6/tables*/
export const getTbales = params => request.get(`/datalake-feed_/v1/feedmgr/nifi/controller-services/${params}/tables`);

// 添加分区时，分区公式  v1/feedmgr/util/partition-functions
export const getPartitionFunctions = params => request.get('/datalake-feed_/v1/feedmgr/util/partition-functions');
// 时间表cron v1/feedmgr/util/cron-expression/preview
export const getCronExpression = params => request.get(`/datalake-feed_/v1/feedmgr/util/cron-expression/preview?cronExpression=${params}`);

// 创建变量库
export function setLibrary(obj) {
  return request({
    url: '/rule_/urule/frame/createFile',
    method: 'post',
    params: obj
  })
}
// 检测表名
export function checkName(obj) {
  return request({
    url: '/rule_/urule/frame/fileExistCheck',
    method: 'post',
    params: obj
  })
}
// 保存变量数据
export function saveLibrary(obj) {
  return request({
    url: '/rule_/urule/dsg/saveFile',
    method: 'post',
    params: obj
  })
}

// 获取知识数据 /urule/packageeditor/loadPackages post /111
export function getLoadPackages(obj) {
  return request({
    url: '/rule_/urule/packageeditor/loadPackages',
    method: 'post',
    params: obj
  })
}
// 启动流程
export function startOneceFeed(id) {
  return request({
    url: `/datalake-feed_/v1/feedmgr/feeds/startFeedOnce/${id}`,
    method: 'post'
  })
}
