import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys_mgr/sign_in',
    method: 'post',
    data
  })
}
// 登出
export const logout = () => {
  return request({
    url: '/sys_mgr/sign_out',
    method: 'post'
  })
}
// 刷新TOKEN
export const reFreshToken = () => {
  return request({
    url: '/sys_mgr/refresh_token',
    method: 'get'
  })
}

// token登录
export const tokenLogin = (data) => {
  return request({
    url: '/sys_mgr/sign_in_token',
    method: 'post',
    data
  })
}
// qrtoken登录
export const qrLogin = (data) => {
  return request({
    url: '/sys_mgr/QRCodeLogin',
    method: 'post',
    data
  })
}