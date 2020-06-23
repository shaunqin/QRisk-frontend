//危险源分类
export const hazardClassification = [{
    aa: "手册编写存在缺陷",
    bb: "职责、内容缺失等",
    cc: "管理文件",
    dd: "H2-01 H2-02 H3-01 R1-01 R2-01",
    ee: "",
    ff: "A1",
    gg: "管理手册",
    hh: "A1-01"
  },
  {
    aa: "程序编写存在缺陷",
    bb: "职责、接口、内容缺失等",
    cc: "管理文件",
    dd: "H2-01 H2-02 H3-01 R1-01 R2-01",
    ee: "A02/C02/C09/D07/D09/D10",
    ff: "A2",
    gg: "修理/排故方案",
    hh: "A2-01"
  },
  {
    aa: "方案制定存在缺陷",
    bb: "步骤缺失、依据错误、拼写错误、逻辑性差、方案错误、分类判定不准",
    cc: "技术文件",
    dd: "B5-01 H2-01 H2-02 H2-03 H3-01 R1-01 R2-01",
    ee: "A01/A02/B01/B04/C01/C03/C05/C15/C16",
    ff: "B1",
    gg: "修理/排故方案",
    hh: "B1-01"
  },
  {
    aa: "未按规定分发文件",
    bb: "未覆盖所有涉及的单位，包括客户文件",
    cc: "文件控制",
    dd: "F1-04 H2-02 H3-01 R1-01 R2-01 R2-02",
    ee: "",
    ff: "C1",
    gg: "分发",
    hh: "C1-01"
  },
  {
    aa: "未按规定粘贴设备操作规程",
    bb: "如粘贴的操作规程非有效版次或未粘贴设备操作规程",
    cc: "工具设备",
    dd: "H2-02 R2-01 R2-02 ",
    ee: "C09/C16",
    ff: "D1",
    gg: "管理",
    hh: "D1-05"
  }
]

//风险清单
export const riskList = [{
  aa: "客舱失压",
  bb: "造成机组成员需要紧急使用氧气",
  cc: "一般事故征候",
  dd: "严重事故征候",
  ee: "严重事故征候"
}, {
  aa: "低于标准放行",
  bb: "低于MEL、CDL放行，超授权、低于运行标准",
  cc: "维修严重差错",
  dd: "维修严重差错",
  ee: "严重差错"
}, {
  aa: "漏检/漏装/错装",
  bb: "发动机、起落架、液压、燃油、飞行操作系统",
  cc: "维修严重差错",
  dd: "维修一般差错",
  ee: "严重差错"
}, {
  aa: "飞机刮碰",
  bb: "机场活动区移动过程中的刮碰",
  cc: "维修严重差错",
  dd: "维修严重差错",
  ee: "严重差错"
}, {
  aa: "应急设备失效/缺失",
  bb: "人为责任原因，且飞机起飞",
  cc: "维修严重差错",
  dd: "维修严重差错",
  ee: "严重差错"
}]

//诱因清单
export const incentiveList = [{
  aa: "法",
  bb: "程序编写存在缺陷"
}, {
  aa: "法",
  bb: "规定编写存在缺陷"
}, {
  aa: "法",
  bb: "厂家源文件存在缺陷"
}, {
  aa: "人",
  bb: "未按规定分发文件"
}, {
  aa: "人",
  bb: "未按规定控制文件有效性"
}]

//风险其他标准
export const riskOtherStandard = [{
    aa: "飞机刮碰",
    bb: "工程部",
    cc: "一般差错",
    dd: "admin",
    ee: "2020/06/09 09:45"
  },
  {
    aa: "漏检/漏装/错装",
    bb: "运行管理部",
    cc: "严重差错",
    dd: "admin",
    ee: "2020/06/09 09:45"
  },
  {
    aa: "发动机空中停车",
    bb: "工程部",
    cc: "事故征候",
    dd: "admin",
    ee: "2020/06/09 09:45"
  },
  {
    aa: "滑梯误放",
    bb: "工程部",
    cc: "一般差错",
    dd: "admin",
    ee: "2020/06/09 09:45"
  },
  {
    aa: "漏取销子/管套",
    bb: "航空安全与质量管理部",
    cc: "严重差错",
    dd: "admin",
    ee: "2020/06/09 09:45"
  },
]

//信息数据库
export const infoDatabase = [{
  aa: "test001",
  bb: "2019/06/09",
  cc: "华北航线中心",
  dd: "呼和浩特分公司",
  ee: "分公司",
  ff: "动机/APU",
  gg: "计量检测",
  hh: "",
  ii: "外部检查",
  jj: "管理文件",
  kk: "工作程序",
  ll: "程序编写存在缺陷",
  mm: "未构成差错不安全事件",
  nn: "8"
}, {
  aa: "test002",
  bb: "2019/06/09",
  cc: "北京基地",
  dd: "发动机大修产品部",
  ee: "分公司",
  ff: "动机/APU",
  gg: "航材管理",
  hh: "",
  ii: "外部检查",
  jj: "技术文件",
  kk: "维修方案",
  ll: "维修方案制定存在缺陷",
  mm: "未构成差错不安全事件",
  nn: "1"
}, {
  aa: "test003",
  bb: "2019/06/09",
  cc: "华北航线中心",
  dd: "呼和浩特分公司",
  ee: "分公司",
  ff: "飞机定检/大修",
  gg: "工程技术",
  hh: "",
  ii: "质量审核",
  jj: "资质能力",
  kk: "资格授权",
  ll: "人员资质不满足工作要求",
  mm: "低于标准放行",
  nn: "1"
}, {
  aa: "test004",
  bb: "2019/06/09",
  cc: "北京基地",
  dd: "发动机大修产品部",
  ee: "分公司",
  ff: "航线维护",
  gg: "安全质量",
  hh: "",
  ii: "质量审核",
  jj: "工具设备",
  kk: "管理",
  ll: "未按规定填写工具借还记录",
  mm: "客舱失压",
  nn: "1"
}, {
  aa: "test005",
  bb: "2019/06/09",
  cc: "华北航线中心",
  dd: "呼和浩特分公司",
  ee: "分公司",
  ff: "航线维护",
  gg: "生产控制",
  hh: "",
  ii: "客户投诉",
  jj: "文件控制",
  kk: "备份",
  ll: "未按规定备份文件",
  mm: "客舱失压",
  nn: "1"
}]

//质量评价
export const qualityEvaluate = [{
  aa: "机械原因航班不正常率",
  bb: "‰",
  cc: "20%",
  dd: "系统获取"
}, {
  aa: "质量事件调查率",
  bb: "‰",
  cc: "15%",
  dd: "系统获取"
}, {
  aa: "机械原因航班不正常率",
  bb: "‰",
  cc: "20%",
  dd: "系统获取"
}, {
  aa: "质量事件调查率",
  bb: "‱",
  cc: "50%",
  dd: "人工报送"
}, {
  aa: "客户质量投诉率",
  bb: "‱",
  cc: "20%",
  dd: "人工报送"
}]
// 安全隐患管控输入
export const safetyHazardControlList = [{
  aa: "航安任务",
  bb: "2020-06-16",
  cc: "2020-06-06",
  dd: "2020-06-06",
  ee: "admin",
  ff: "2",
  gg: "2020-06-16",
  hh: "维修实施",
  ii: "完成",
  jj:"YP2020050501"
},{
  aa: "航安任务",
  bb: "2020-06-16",
  cc: "2020-06-06",
  dd: "2020-06-06",
  ee: "admin",
  ff: "2",
  gg: "2020-06-16",
  hh: "维修实施",
  ii: "完成",
  jj:"YP2020050502"
},{
  aa: "航安任务",
  bb: "2020-06-16",
  cc: "2020-06-06",
  dd: "2020-06-06",
  ee: "admin",
  ff: "2",
  gg: "2020-06-16",
  hh: "维修实施",
  ii: "完成",
  jj:"YP2020050503"
},{
  aa: "航安任务",
  bb: "2020-06-16",
  cc: "2020-06-06",
  dd: "2020-06-06",
  ee: "admin",
  ff: "2",
  gg: "2020-06-16",
  hh: "维修实施",
  ii: "完成",
  jj:"YP2020050504"
},{
  aa: "航安任务",
  bb: "2020-06-16",
  cc: "2020-06-06",
  dd: "2020-06-06",
  ee: "admin",
  ff: "2",
  gg: "2020-06-16",
  hh: "维修实施",
  ii: "完成",
  jj:"YP2020050505"
}]

//安全隐患管控输出
export const safetyHazardsFollow=[{
  aa: "方案制定存在缺陷",
  bb: "2020-06-16",
  cc: "2020-06-16",
  dd: "2020-06-16",
  ee: "admin",
  ff: "完成",
  jj:"YP2020050501",
  gg:"上海",hh:"2020-02-22",ii:"明细记录"
},{
  aa: "方案制定存在缺陷",
  bb: "2020-06-16",
  cc: "2020-06-16",
  dd: "2020-06-16",
  ee: "admin",
  ff: "完成",
  jj:"YP2020050502",
  gg:"上海",hh:"2020-02-22",ii:"明细记录"
},{
  aa: "方案制定存在缺陷",
  bb: "2020-06-16",
  cc: "2020-06-16",
  dd: "2020-06-16",
  ee: "admin",
  ff: "完成",
  jj:"YP2020050503",
  gg:"上海",hh:"2020-02-22",ii:"明细记录"
},{
  aa: "方案制定存在缺陷",
  bb: "2020-06-16",
  cc: "2020-06-16",
  dd: "2020-06-16",
  ee: "admin",
  ff: "完成",
  jj:"YP2020050504",
  gg:"上海",hh:"2020-02-22",ii:"明细记录"
},{
  aa: "方案制定存在缺陷",
  bb: "2020-06-16",
  cc: "2020-06-16",
  dd: "2020-06-16",
  ee: "admin",
  ff: "完成",
  jj:"YP2020050505",
  gg:"上海",hh:"2020-02-22",ii:"明细记录"
}]