import request from '@/utils/request'

// 风险评估作图
export function getRiskAssessmentChartData(number) {
    return request({
        url: `/info_mgr/supervise_mgr/query/riskAssessment`,
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
