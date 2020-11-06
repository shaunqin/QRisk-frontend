import request from '@/utils/request'

// 风险评估作图
export function getRiskAssessmentChartData(params) {
    return request({
        // url: `/info_mgr/supervise_mgr/query/riskAssessment`,
        url: `/dangerManagerment/riskAssessment/query/report`,
        method: 'get',
        params
    })
}

// 风险评估：生成图表
export function quertChartOfType(params) {
    return request({
        url: `/dangerManagerment/riskAssessment/query/chart/${params.x}`,
        method: 'get',
        params
    })
}

// 报表导出
export function downloadToExcel(params) {
    return request({
        url: `/dangerManagerment/riskAssessment/query/downloadToExcel`,
        method: 'get',
        params
    })
}

// 图表导出
export function downloadToExcelImage(data) {
    return request({
        url: `/dangerManagerment/riskAssessment/downloadToExcelImage`,
        method: 'post',
        data
    })
}

// =========  风险提示  ==============
// 风险提示 详情
export function riskNoticeDetail(id) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/query/detail/${id}`,
        method: 'get',
    })
}
// 风险提示 我的提交详情
export function riskNoticeSubDetail(id) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/query/submitDetail/${id}`,
        method: 'get',
    })
}
// 添加风险提示
export function riskNoticeAdd(data) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/add`,
        method: 'post',
        data
    })
}
// 修改风险提示
export function riskNoticeModify(data) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/modify`,
        method: 'put',
        data
    })
}
// 删除风险提示
export function riskNoticeDelete(id) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/delete/${id}`,
        method: 'delete'
    })
}
// 提交风险提示
export function riskNoticeSubmit(id, params) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/submit/${id}`,
        method: 'put',
        params
    })
}
// 根据task显示不同的内容
export function riskNoticeQueryTask(taskId, formId) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/query/${taskId}/${formId}`,
        method: 'get'
    })
}
// 处理待办
export function riskNoticeComplete(data) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/complete/${data.taskId}`,
        method: 'post',
        data
    })
}
// 单位下发安全风险提示措施
export function riskNoticeIssue(data) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/issue/${data.id}`,
        method: 'post',
        data
    })
}
// 查询已办详情
export function riskNoticeDoneDetail(taskId, formId) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/query/hasDoneDetail/${taskId}/${formId}`,
        method: 'get'
    })
}
// 领导验证密码
export function validatePWD(password) {
    return request({
        url: `/riskmgr_mgr/safety_risk_notice_mgr/validatePWD`,
        method: 'post',
        data: { password }
    })
}
// =========  风险提示 end ==============

// ======== 专项风险 =======
// 添加通知
export function specialRiskAdd(data) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/add`,
        method: 'post',
        data
    })
}
// 详情
export function specialRiskDetail(id) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/query/detail/${id}`,
        method: 'get',
    })
}
// 修改
export function specialRiskModify(data) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/modify`,
        method: 'put',
        data
    })
}
// 删除
export function specialRiskDelete(id) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/delete/${id}`,
        method: 'delete'
    })
}
// 提交
export function specialRiskSubmit(id) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/submit/${id}`,
        method: 'get'
    })
}
// 填报
export function specialRiskFill(taskId) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/fill/${taskId}`,
        method: 'get'
    })
}
// 填报危险源清单并生成风险评价报告
export function specialRiskSaveHazard(data) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/saveHazard`,
        method: 'post',
        data
    })
}
// 处理待办
export function specialRiskComplete(data) {
    return request({
        url: `/risk_mgr/special_risk_notice_mgr/complete`,
        method: 'post',
        data
    })
}
// ======== 专项风险 end =======