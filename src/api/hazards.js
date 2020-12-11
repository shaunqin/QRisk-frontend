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

// 处理待办
export const hazardsComplete = (data) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/complete/${data.taskId}`,
        method: 'post',
        data
    })
}
// 获取编号
export const getNo = (deptPath) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/nextNo/${deptPath}`,
        method: 'get',
    })
}
// 删除编号
export const deleteNo = (deleteNo) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/deleteNo/${deleteNo}`,
        method: 'delete',
    })
}
// 查看管控清单详情
export const queryControlListDetail = (monthTaskId) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/query/controlList/${monthTaskId}`,
        method: 'get',
    })
}

// 查询已办详情
export const queryHasDoneDetail = (formId) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/query/hasDoneDetail/${formId}`,
        method: 'get',
    })
}
// 复制到自己
export const copyHiddenDanger = (hiddenDangerId) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/copy/${hiddenDangerId}`,
        method: 'post',
    })
}
// modify 自己的复制
export const modifyHiddenDanger = (data) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/modifyHiddenDanger`,
        method: 'put',
        data
    })
}

// cancel 取消任务
export const cancelHiddenDanger = (taskId, type) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/cancel/${taskId}/${type}`,
        method: 'delete',
    })
}
// delete 取消任务
export const deleteHiddenDanger = (taskId, type) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/delete/${taskId}/${type}`,
        method: 'delete',
    })
}

// 待办数量
export function queryTodoCount() {
    return request({
        url: `/riskmgr_mgr/hidden_danger/query/queryTodoCount`,
        method: 'get',
    })
}

// 原始表单详情
export function getOriginFormByCommentId(params) {
    return request({
        url: `/riskmgr_mgr/hidden_danger/getOriginFormByCommentId`,
        method: 'get',
        params
    })
}

// 导出
export function exportList(type, params) {
    return request({
        url: `/riskmgr_mgr/hidden_danger/export/myControlList/${type}`,
        method: 'get',
        params
    })
}

// 判断是否有操作权限
export const hasOperatePerms = () => {
    return request({
        url: '/riskmgr_mgr/hidden_danger/hasOperatePerms',
        method: 'get',
    })
}

// 隐患在控详情
export const getHiddenControlDetail = (id) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/getControl/${id}`,
        method: 'get',
    })
}
// 隐患在控导出
export const hiddenControlExport = (params) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/exportMyControlList`,
        method: 'get',
        params
    })
}

// 查询所有下发任务
export const queryIssueTreeData = (monthTaskId) => {
    return request({
        url: `/riskmgr_mgr/hidden_danger/treeData/${monthTaskId}`,
        method: 'get',
    })
}