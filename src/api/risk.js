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
// 保存并提交风险提示 
export function riskNoticeSaveandSubmit(data) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/saveAndSubmit`,
    method: 'post',
    data
  })
}
// 更新并提交风险提示 
export function riskNoticeUpdateandSubmit(data) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/updateAndSubmit`,
    method: 'post',
    data
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
export function riskNoticeDoneDetail(formId) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/query/hasDoneDetail/${formId}`,
    method: 'get'
  })
}
export function riskNoticeDoneDetail2(formId) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/query/hasDoneDetail2/${formId}`,
    method: 'get'
  })
}
// 领导验证密码
export function validatePWD(password) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/validatePWD`,
    method: 'post',
    data: {
      password
    }
  })
}
// 验证添加权限
export function verifyPerms() {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/verifyPerms`,
    method: 'get',
  })
}
// 待办数量
export function queryTodoCount() {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/query/queryTodoCount`,
    method: 'get',
  })
}
// 历史版本详情
export function getOriginFormByCommentId(params) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/getOriginFormByCommentId`,
    method: 'get',
    params
  })
}
// 抄送人员列表
export function queryFillCC(deptPath) {
  return request({
    url: `/process/query/fillCC`,
    method: 'get',
    params: {
      deptPath
    }
  })
}
// 发起单位
export function queryRiskMgrDept() {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/query/riskMgrDepts`,
    method: 'get',
  })
}
// 查询树形下发措施
export function queryIssueTreeData(measureId) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/treeData/${measureId}`,
    method: 'get',
  })
}
// 查询树形下发措施
export function needSubmit2Leader(deptPath) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/needSubmit2Leader`,
    method: 'get',
    params: { deptPath }
  })
}
// 提醒风险管理员
export function noticeRiskManger(data) {
  return request({
    url: `/riskmgr_mgr/hidden_danger/noticeRiskManger`,
    method: 'post',
    data
  })
}
// 提醒风险管理员
export function riskNoticeRiskManger(data) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/noticeRiskManger`,
    method: 'post',
    data
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
export function specialRiskSubmit(id, params) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/submit/${id}`,
    method: 'get',
    params
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
// 子任务下发
export function specialRiskIssue(data) {
  return request({
    url: '/risk_mgr/special_risk_notice_mgr/issue',
    method: 'post',
    data
  })
}
// 查询已办详情
export function specialRiskGasDoneDetail(taskId, formId) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/query/hasDoneDetail/${taskId}/${formId}`,
    method: 'get',
  })
}
// 待办数量
export function specialRiskQueryTodoCount(params) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/query/queryTodoCount`,
    method: 'get',
    params
  })
}
// 查询对应风险评价报告
export function specialRiskGetEvalReport(formId) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/getEvalReport`,
    method: 'get',
    params: {
      formId
    }
  })
}
// 保存风险评价报告
export function specialRiskSaveEvalReport(data) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/saveEvalReport`,
    method: 'post',
    data
  })
}
// 导出当前风险评价报告
export function exportEvalReport(id) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/export/evalReport/${id}`,
    method: 'get'
  })
}
// 查询风险等级
export function specialRiskQueryRiskLevel(hazard, risk) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/getRiskLevel/${hazard}/${risk}`,
    method: 'get',
  })
}

// 查询危险源
export function queryHazard() {
  return request({
    url: '/info_mgr/hazard_mgr/query/hazard',
    method: 'get',
  })
}
// 查询风险列表不分页
export function queryRiskListMgr() {
  return request({
    url: '/info_mgr/riskList_mgr/query/list',
    method: 'get',
  })
}
// 查询树形下发措施和下发通知
export function queryIssueTreeNoteData(type, id) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/treeData/${type}/${id}`,
    method: 'get',
  })
}

// 查询关键风险清单
export function queryTableList() {
  return request({
    url: '/risk_mgr/special_risk_notice_mgr/tableList',
    method: 'get',
  })
}
// 发起单位
export function querySpeRiskMgrDept() {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/query/riskMgrDepts`,
    method: 'get',
  })
}
// 提醒风险管理员
export function specialNoticeRiskManger(data) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/noticeRiskManger`,
    method: 'post',
    data
  })
}
// 发起单位
export function queryIsLM(id) {
  return request({
    url: `/risk_mgr/special_risk_notice_mgr/isLM/${id}`,
    method: 'get',
  })
}
// ======== 专项风险 end =======

// 风险提示编号
export function getRiskNoticeNo(deptPath) {
  return request({
    url: `/riskmgr_mgr/safety_risk_notice_mgr/getNextNo`,
    method: 'get',
    params: { deptPath }
  })
}

// ======= 在控风险管理 ============
// 查询我的待办数量
export function riskControlQueryTodoCount() {
  return request({
    url: `/riskControlManage/riskControlManage/query/queryTodoCount`,
    method: 'get',
  })
}
// 新增:在控风险
export function riskControlAdd(data) {
  return request({
    url: `/riskControlManage/riskControlManage/add`,
    method: 'post',
    data
  })
}
// 查询风险评价报告详情
export function riskControlDetail(id) {
  return request({
    url: `/riskControlManage/riskControlManage/query/detail/${id}`,
    method: 'get',
  })
}
// 修改
export function riskControlModify(data) {
  return request({
    url: `/riskControlManage/riskControlManage/modify`,
    method: 'put',
    data
  })
}
// 删除
export function riskControlDelete(id) {
  return request({
    url: `/riskControlManage/riskControlManage/delete/${id}`,
    method: 'delete',
  })
}
// 提交
export function riskControlSubmit(id, params) {
  return request({
    url: `/riskControlManage/riskControlManage/submit/${id}`,
    method: 'put',
    params
  })
}
// 修改提交
export function riskControlUpdateAndSubmit(data) {
  return request({
    url: `/riskControlManage/riskControlManage/updateAndSubmit`,
    method: 'post',
    data
  })
}
// 查询办理详情
export function riskControlQueryDetailTask(taskId, formId) {
  return request({
    url: `/riskControlManage/riskControlManage/query/${taskId}/${formId}`,
    method: 'get'
  })
}
// 处理待办
export function riskControlComplete(data) {
  return request({
    url: `/riskControlManage/riskControlManage/complete/${data.taskId}`,
    method: 'post',
    data
  })
}
// 单位下发风险评价报告
export function riskControlIssue(data) {
  return request({
    url: `/riskControlManage/riskControlManage/issue/${data.id}`,
    method: 'post',
    data
  })
}
// 查询已办详情
export function riskControlHasDoneDetail(taskId, formId) {
  return request({
    url: `/riskControlManage/riskControlManage/query/hasDoneDetail/${taskId}/${formId}`,
    method: 'get'
  })
}
// 查询在控风险详情
export function riskControlDetailByFormId(formId) {
  return request({
    url: `/riskControlManage/riskControlManage/query/detailByFormId/${formId}`,
    method: 'get'
  })
}
// 通知对应用户执行待办事项
export function riskControlSendDealNotice(formId) {
  return request({
    url: `/riskControlManage/riskControlManage/query/sendDealNotice/${formId}`,
    method: 'get',
  })
}
// 查询在控风险树形下发记录
export function riskControlIssueTreeData(formId) {
  return request({
    url: `/riskControlManage/riskControlManage/treeData/${formId}`,
    method: 'get',
  })
}
// 措施上报的责任单位
export function riskControlrRespDeptTree(params) {
  return request({
    url: `/riskControlManage/riskControlManage/query/respDeptTree/${params.path}`,
    method: 'get',
  })
}
// 提醒风险管理员
export function rriskControlrNoticeRiskManger(data) {
  return request({
    url: `/riskControlManage/riskControlManage/noticeRiskManger`,
    method: 'post',
    data
  })
}
// ======= 在控风险管理 end ========

// =========  风险措施管控  ==============
// 查询对应风险评价报告
export function getEvalReport(params) {
  return request({
    url: '/risk_mgr/riskMeasureControl_mgr/getEvalReport',
    method: 'get',
    params
  })
}

// 通知对应用户执行待办事项
export function notifyUser(params) {
  return request({
    url: '/risk_mgr/riskMeasureControl_mgr/notifyUser',
    method: 'get',
    params
  })
}
// ======= 风险措施管控 end ========