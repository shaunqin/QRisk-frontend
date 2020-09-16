import request from '@/utils/request'

// 安全调查|质量调查|客户投诉 add
export const addInfobase = (data) => {
    return request({
        url: `/infoDatabase_mgr/infoDatabase_mgr/add`,
        method: 'post',
        data
    })
}