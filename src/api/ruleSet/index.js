import request from '@/utils/request'
// 规则

// 规则知识报列表
export function getKnowledge(name) {
  return request({
    url: `/rule_/urule/packageeditor/loadPackages?project=${name}`,
    method: 'get'
  })
}
// 获取知识包库名
export function getRuleName() {
  return request({
    url: '/rule_/v1/urule/getName',
    method: 'get'
  })
}