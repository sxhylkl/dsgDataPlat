import request from '@/utils/request'

//获取所有根节点
export function GetAllRoot() {
  return request({
    url: '/api/neo4j/Neo4j/GetAllRoot',
    //url:`http://192.168.23.52:8089/Neo4j/GetAllRoot`,
    method: 'get',
  })
}
//获取下一层所有节点
export function GetNextLevel(id) {
  return request({
    url: `/api/neo4j/Neo4j/GetNodeChildrenNoType/${id}`,
    //url:`http://192.168.23.52:8089/Neo4j/GetNodeChildrenNoType/${id}`,
    method: 'get',
  })
}
//获取该节点下的所有子节点
export function GetAllChildren(id) {
  return request({
    url: `/api/neo4j/Neo4j/GetNodeAllChildren/${id}`,
    //url:`http://192.168.23.52:8089/Neo4j/GetNodeAllChildren/${id}`,
    method: 'get',
  })
}
