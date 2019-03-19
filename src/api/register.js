import request from '@/utils/request'

export function register(obj) {
  return request({
    url: 'api/admin/user/register',
    method: 'post',
    data: obj
  })
}
