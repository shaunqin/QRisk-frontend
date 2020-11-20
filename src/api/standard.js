import request from '@/utils/request'

// 矩阵图数据
export function queryMatrixData(deptPath) {
  return request({
    url: `/info_mgr/riskLevel_mgr/query/matrix_graph/${deptPath}`,
    method: 'get'
  })
}

// 风险清单 - list
export const queryRiskList = (params) => {
  return request({
    url: `/info_mgr/riskList_mgr/query/list`,
    method: 'get',
    params
  })
}
//危险源列表
export const queryHazardList = (params) => {
  return request({
    url: `/info_mgr/hazard_mgr/query/list`,
    method: 'get',
    params
  })
}
// 诱因 list
export const queryIncentiveList = () => {
  return request({
    url: `/info_mgr/incentive_mgr/query/all`,
    method: 'get'
  })
}

// 风险等级标准
export const queryRiskLevelStandard = (params) => {
  return request({
    url: `/info_mgr/risk_value_standard_mgr/query/all`,
    method: 'get',
    params
  })
}