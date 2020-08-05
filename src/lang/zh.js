export default {
  route: {
    dashboard: '首页',
    audit: '审核',
    auditPlan: '审核计划',
    auditTask: '审核任务',
    auditConclusion: '审核结论',
    checkList: '检查单管理',
    maintain: '供应商管理',
    systemManage: '系统管理',
    userManage: '员工管理',
    rolesManage: '角色管理',
    authorityManage: '权限管理',
    dataDictionary: '数据字典',
    standard: '规范/标准',
    infoCategory: '信息分类标准',
    dataSources: '数据来源',
    responsibleUnit: '责任单位',
    productSystem: '产品系统',
    hazardClassification: '危险源分类',
    riskList: '风险清单',
    incentiveList: '诱因清单',
    riskManagement: '风险评价标准',
    otherStandard: '其他标准',
    companyPossibility: '公司级可能性等级',
    companySeriousness: '公司级严重性等级',
    companyRisk: '公司级风险等级',
    unitPossibility: '各单位可能性等级',
    unitSeriousness: '各单位严重性等级',
    unitRisk: '各单位风险等级',
    infoDatabase: '信息数据库',
    supervision: '监督检查',
    safeSelfExamination: '安全自查',
    qualityAudit: '质量审核',
    externalInspection: '外部检查',
    safeInvestigation: '安全调查',
    qualityInvestigation: '质量调查',
    customerComplaints: '客户投诉',
    riskAssessment: '风险评估',
    dangerManagerment: '风险管理',
    riskControl: '安全风险管控',
    riskAssessmentDataExport: '风险评价报告',
    safetyRiskPrompt: '安全风险提示',
    riskAssessmentProcess: '安全风险评估',
    dangerEvaluate: '风险评价',
    riskListManager: '风险清单管理',
    riskListDown: '风险清单下发',
    riskListAccept: '风险清单接收',
    riskListSearch: '已确认风险清单',
    riskMeasureReport: '风险措施上报',
    riskMeasureInput: '风险措施填写',
    riskMeasureConfirm: '风险措施确认',
    riskMeasureSearch: '已确认风险措施',
    implementationResultsReport: '实施结果上报',
    riskImplementationInput: '风险实施填写',
    riskImplementationConfirm: '风险实施确认',
    riskImplementationSearch: '已确认风险实施',
    hiddenDangerInvestigation: '隐患排查',
    safetyHazardControlList: '任务单下发',
    safetyHazardsStatistics: '安全隐患统计上报',
    safetyHazardsFollow: '安全隐患上报',
    qualityEvaluation: '质量评价',
    qualityEvaluate: '质量评价查询',
    taskHairdown: '任务单下发',
    qualityReport: '质量数据上报',
    notice: '通知',
    agencyMatters: '代办事项',
    workDone: '已办事项'
  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定'
  },
  example: {
    warning: '创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于 component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用 keep-alive 的 include，直接缓存所有页面。详情见'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  pdf: {
    tips: '这里使用   window.print() 来实现下载pdf的功能'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  }
}
