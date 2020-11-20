import request from '@/utils/request'

// 添加年度任务/月度任务
export function taskAdd(data) {
    return request({
        url: '/task_mgr/add',
        method: 'post',
        data
    })
}
// 修改年度任务/月度任务
export function taskModify(data) {
    return request({
        url: '/task_mgr/yearTask/modify',
        method: 'put',
        data
    })
}

// 填报月度任务指标参数
export function fillInMonthTask(data) {
    return request({
        url: '/task_mgr/fillInMonthTask',
        method: 'post',
        data
    })
}
// 修改填报的月度任务数据
export function updateMonthTaskParam(data) {
    return request({
        url: '/task_mgr/updateMonthTaskParam',
        method: 'post',
        data
    })
}
// 查询月度任务详情
export function monthTaskDetail(id) {
    return request({
        url: `/task_mgr/query/monthTask/detail/${id}`,
        method: 'get',
    })
}

// 查询产品质量评价指标参数数值
export function queryIndexList(params) {
    return request({
        url: `/quality_mgr/query/indexList`,
        method: 'get',
        params
    })
}
// 质量评价月度报告作图
export function queryReportData(params) {
    return request({
        url: `/quality_mgr/query/getReport`,
        method: 'post',
        params
    })
}

// 查询年度任务详情
export function queryYearTaskDetail(id) {
    return request({
        url: `/task_mgr/query/yearTask/detail/${id}`,
        method: 'get',
    })
}

// 根据编号查询默认设置值
export function queryDefaultValue(params) {
    return request({
        url: `/sys_mgr/defaultSetting_mgr/query/defaultValue`,
        method: 'get',
        params
    })
}