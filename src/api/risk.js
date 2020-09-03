import request from '@/utils/request'

// 风险评估作图
export function getRiskAssessmentChartData(number) {
    return request({
        // url: `/info_mgr/supervise_mgr/query/riskAssessment`,
        url: `/dangerManagerment/riskAssessment/query/report`,
        method: 'get',
        params: { number }
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