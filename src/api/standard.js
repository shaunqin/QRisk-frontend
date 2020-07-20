import request from '@/utils/request'

// 矩阵图数据
export function queryMatrixData(deptPath) {
    return request({
      url: `/info_mgr/riskLevel_mgr/query/matrix_graph/${deptPath}`,
      method: 'get'
    })
  }