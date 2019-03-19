import request from '@/utils/request'


export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    grant_type: 'password'
  }
  return request({
    url: '/api/auth/oauth/token',
    method: 'post',
    data,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout(token) {
  return request({
    url: '/api/auth/oauth/token',
    method: 'delete',
    params: {
      access_token: token
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/user/front/info',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/api/admin/user/front/menus',
    method: 'get'
  })
}

export function getAllMenus() {
  return request({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  })
}