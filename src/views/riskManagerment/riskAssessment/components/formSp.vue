<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="新增"
    custom-class="big_dialog"
  >
    <el-form size="mini" label-width="auto">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="部门">
            <department :value="form.dept" @change="deptChange" />
          </el-form-item>
          <el-form-item label="批准">
            <el-input v-model="form.pizhun"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分析人">
            <el-input v-model="form.fenxir"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" placeholder></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="list" size="mini" :span-method="objectSpanMethod" border>
      <el-table-column label="系统" prop="system" />
      <el-table-column label="子系统" prop="subSystem" />
      <el-table-column label="管理流程" prop="management" />
      <el-table-column label="危险源描述" prop="hazardDescribe" min-width="300" />
      <el-table-column label="危险源" prop="hazardSources" min-width="200" />
      <el-table-column label="ID" prop="ID" />
      <el-table-column label="可能性" width="110">
        <template slot-scope="{row}">
          <el-select v-model="row.possibility" placeholder>
            <el-option label="可能性" value="可能性"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="严重性" prop="seriousness" />
      <el-table-column label="可能导致的风险" prop="possibleRisks" min-width="140" />
      <el-table-column label="风险等级" prop="riskLevel" />
      <el-table-column label="根原因分析" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.rootCauseAnalysis" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="控制措施" min-width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.controlMeasures" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="责任单位" width="160">
        <template slot-scope="{row}">
          <department :value="row.responsible" @change="respChange($event,row)" />
        </template>
      </el-table-column>
      <el-table-column label="控制状态" width="110">
        <template slot-scope="{row}">
          <el-select v-model="row.controlState">
            <el-option label="控制状态" value="控制状态"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import department from '@/components/Department'
export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      list: [
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '开航信息、适用机型、考察需求提供不及时、不准确', hazardSources: '未按规定传递信息', ID: 'J4-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '前期对当地航站维修资源了解不到位', hazardSources: '其他', ID: 'T2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '机务考察组织实施不及时', hazardSources: '其他', ID: 'T2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '航站当地易发生台风和雪霜天气', hazardSources: '恶劣天气', ID: 'T2-01', possibility: '', seriousness: '4', possibleRisks: '飞机刮碰', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地机场通用工具设备不足（如：轮档、安全锥', hazardSources: '工具设备资源不足', ID: 'J2-02', possibility: '', seriousness: '4', possibleRisks: '飞机刮碰', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方机务维修工作基本工具不能满足要求', hazardSources: '工具设备资源不足', ID: 'J2-02', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方机务维修工作梯不满足要求', hazardSources: '工具设备资源不足', ID: 'J2-03', possibility: '', seriousness: '4', possibleRisks: '飞机刮碰', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方机务维修拖把不满足要求', hazardSources: '工具设备资源不足', ID: 'J2-04', possibility: '', seriousness: '3', possibleRisks: '飞机损伤', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方特种车辆不足', hazardSources: '工具设备资源不足', ID: 'J2-05', possibility: '', seriousness: '4', possibleRisks: '飞机刮碰', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方无航材存放条件', hazardSources: '不能满足存储要求', ID: 'F1-02', possibility: '', seriousness: '2', possibleRisks: '器材损坏', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方无法提供机库', hazardSources: '不能满足工作要求', ID: 'F1-03', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '航材配备不能及时到位', hazardSources: '工作所需器材准备不足', ID: 'J2-03', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '油料配备不能及时到位', hazardSources: '工作所需器材准备不足', ID: 'J2-03', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '工具设备配备不能及时到位', hazardSources: '工具设备资源不足', ID: 'J2-02', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地无除防冰能力（如适用）', hazardSources: '其他', ID: 'T2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方没有符合资格要求的勤务、维修、放行人员', hazardSources: '人员资质不满足工作要求', ID: 'H1-01', possibility: '', seriousness: '4', possibleRisks: '未授权人员签字放行飞机', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方勤务、维修、放行人员人员数量不足', hazardSources: '合格的维修人员数量不足', ID: 'J2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方机务人员无或欠缺执飞机型相关维修放行经验', hazardSources: '缺少相关工作经验', ID: 'H3-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方维修、放行人员未授权，勤务人员未声明', hazardSources: '人员资质不满足工作要求', ID: 'H1-01', possibility: '', seriousness: '4', possibleRisks: '未授权人员签字放行飞机', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '人员培训不能及时完成', hazardSources: '未按规定开展各类人员培训/复训', ID: 'I2-01', possibility: '', seriousness: '4', possibleRisks: '未授权人员签字放行飞机', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地代理方欠缺相关机务管理程序', hazardSources: '其他', ID: 'T2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '机务协议未及时签署', hazardSources: '其他', ID: 'T2-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地无可用工作单', hazardSources: '未按规定分发文件', ID: 'C1-01', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '当地手册不能接近（获取）', hazardSources: '相关技术文件准备不足', ID: 'J2-04', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
        { system: '维修工程', subSystem: '维修计划和控制', management: 'ESM LM 022 新开航站机务考察和维修资源准备管理程序', hazardDescribe: '航站维修资源需求执行情况未确认', hazardSources: '未按规定执行运行支持工作', ID: 'L1-35', possibility: '', seriousness: '1', possibleRisks: '影响航班运行', riskLevel: '1', rootCauseAnalysis: '', controlMeasures: '', responsible: null, controlState: '' },
      ],
      spanArr: [25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  created() {
    // this.spanArr = [];
    // for (let index = 0; index < this.list.length; index++) {
    //   if (index == this.list.length - 1) {
    //     this.spanArr.push[this.list.length]
    //   } else {
    //     this.spanArr.push(0)
    //   }
    // }
  },
  methods: {
    deptChange(val) {
      this.form.dept = val;
    },
    respChange(val, row) {
      row.responsible = val;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    }
  },
}
</script>

<style lang="scss" scoped>
</style>