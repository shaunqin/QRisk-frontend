import request from '@/utils/request'

// 安全调查|质量调查|客户投诉 add
export const addInfobase = (data) => {
    return request({
        url: `/infoDatabase_mgr/infoDatabase_mgr/add`,
        method: 'post',
        data
    })
}
// 安全调查|质量调查|客户投诉 modify
export const modifyInfobase = (data) => {
    return request({
        url: `/infoDatabase_mgr/infoDatabase_mgr/modify`,
        method: 'put',
        data
    })
}

// 安全调查|质量调查|客户投诉 detail
export const detailInfobase = (id) => {
    return request({
        url: `/infoDatabase_mgr/infoDatabase_mgr/query/detail/${id}`,
        method: 'get'
    })
}
// 安全调查|质量调查|客户投诉 del
export const delInfobase = (id) => {
    return request({
        url: `/infoDatabase_mgr/infoDatabase_mgr/delete/${id}`,
        method: 'delete'
    })
}