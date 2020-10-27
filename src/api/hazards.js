import request from '@/utils/request'

// 添加
export const add = (data) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/add`,
        method: 'post',
        data
    })
}

// 详情
export const detail = (id, type) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/detail/${id}/${type}`,
        method: 'get'
    })
}

// 修改
export const modify = (data) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/modify`,
        method: 'put',
        data
    })
}

// 查询待办详情，根据待办task显示不同的内容
export const queryHazards = (taskId, formId) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/query/${taskId}/${formId}`,
        method: 'get'
    })
}

// 单位下发月度任务
export const hazardsIssue = (data) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/issue/${data.id}`,
        method: 'post',
        data
    })
}