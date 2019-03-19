// 基础地址
const baseUrl = `http://${window.location.hostname}`;
const local = 'http://localhost'

// 服务地址（iframe）
const severUrl = {
  jonUrl: local + ':9422',
  swaggerUrl: baseUrl + ':8767/swagger-ui.html',
  eurekaUrl: baseUrl + ':8761',
  monitorUrl: baseUrl + ':8764',
  zipkinUrl: local + ':9411',
  dataUrl: local + ':9528/static/dataCenter/index.html',
  swUrl: baseUrl + ':9413/#/monitor/dashboard',
  ruleUrl: baseUrl +':10009/urule/frame' // 规则引擎
}

// 网关api接口地址
// const apiUrl = baseUrl + ':8767';

/* 业务审核系统前缀（无需配置） */
const url = {
  agile: '/dsg-bpm'
}
