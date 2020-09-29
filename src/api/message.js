import request from '@/utils/request'

// 清空自己的提示
export function clean() {
  return request({
    url: `/notice/clean`,
    method: 'delete'
  })
}

// 批量删除
export const deleteBatch = (ids) => {
  return request({
    url: `/notice/deleteBatch`,
    method: 'delete',
    data: { ids }
  })
}
//查询提示详情并已读
export const queryHazardList = (id) => {
  return request({
    url: `/notice/query/detail/${id}`,
    method: 'get',
  })
}

// 清空未读提示
export function queryUnread() {
  return request({
    url: `/notice/unreadAmount`,
    method: 'get'
  })
}