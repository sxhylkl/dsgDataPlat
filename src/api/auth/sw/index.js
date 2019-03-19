import request from '@/utils/request'

export default function loginSw(obj) {
  return request({
    url: '/sw/login/account',
    method: 'post',
    data: JSON.stringify(obj)
  });
}
