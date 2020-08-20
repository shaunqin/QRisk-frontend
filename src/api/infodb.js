import request from '@/utils/request'

// 风险评估作图
export function getRiskAssessmentChartData(number) {
    return request({
        url: `/info_mgr/supervise_mgr/query/riskAssessment`,
        method: 'get',
        params: { number }
    })
}