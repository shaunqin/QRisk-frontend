import request from '@/utils/request'

// 导航栏数量
export const queryCount = () => {
    return request({
        url: `/process/query/toDoCount`,
        method: 'get',
    })
}