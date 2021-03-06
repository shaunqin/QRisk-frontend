import request from '@/utils/request'

// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/staff_mgr/add',
    method: 'post',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/sys_mgr/staff_mgr/delete/${id}`,
    method: 'delete'
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/sys_mgr/staff_mgr/modify',
    method: 'put',
    data
  })
}
// 搜索
export const detail = (id) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/detail/${id}`,
    method: 'get'
  })
}
// 根据用户名查询用户个人信息
export const findEmployByUserName = (userName) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/byUserName/${userName}`,
    method: 'get'
  })
}
// 模糊查询
export const queryLikeList = (userName) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/likeList/${userName}`,
    method: 'get'
  })
}
// 查询当前用户个人信息
export const findCurrentUser = () => {
  return request({
    url: `/sys_mgr/currentUser`,
    method: 'get'
  })
}
// 查询部门
/* export const queryDepartmentTree = (url, params) => {
  return request({
    // url: `/sys_mgr/department_mgr/query/tree`,
    url,
    method: 'get',
    params
  })
} */
// 查询部门 根据角色
export const queryDepartmentTreeByRole = () => {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/deptTree`,
    method: 'post'
  })
}
// 查询部门(根据url查询部门或子部门)
export const queryDepts = (url, params) => {
  return request({
    // url: `/riskmgr_mgr/safety_risk_notice_mgr/query/depts`,
    url,
    method: 'get',
    params
  })
}
// 查询人 风险提示下发人
export const queryEmplotee = (params) => {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/query/nextOperator`,
    method: 'get',
    params
  })
}

// 查询所有人
export const queryEmploteeAll = () => {
  return request({
    url: `/sys_mgr/staff_mgr/query/all`,
    method: 'get',
  })
}
// 查询下一操作人
export const queryNextOperator = (noteId) => {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/query/nextOperator/${noteId}`,
    method: 'get'
  })
}

// 在控风险-查询下一操作人
export const riskControlQueryNextOperator = (params) => {
  return request({
    url: `/riskControlManage/riskControlManage/query/nextOperator`,
    method: 'get',
    params
  })
}

// 查询指定部门的风险管理员
export const queryDeptRiskManager = (deptPath) => {
  return request({
    url: `/process/query/queryDeptRiskManager`,
    method: 'get',
    params: { deptPath }
  })
}