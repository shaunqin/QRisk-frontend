<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form size="mini" label-width="auto">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item>
            <template slot="label">
              {{ form.type != '2' ? '下发部门' : '分析单位' }}
            </template>
            <deptByRole
              v-if="form.type != '2'"
              :value="form.issueDepts"
              :multiple="true"
              @change="deptChange($event, 'issueDepts')"
            ></deptByRole>
            <department
              v-else
              class="form-dept-tree mini"
              :value="form.issueDepts"
              @change="deptChange($event, 'issueDepts')"
            />
          </el-form-item>
          <el-form-item label="批准人">
            <el-input v-model="form.approval"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option label="通知" value="1"></el-option>
              <el-option label="评估" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分析人">
            <el-input v-model="form.analysis"></el-input>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="form.endTime"
              value-format="yyyy-MM-dd"
              placeholder
              style="width: 100%"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="list"
      size="mini"
      :span-method="objectSpanMethod"
      border
      height="550"
    >
      <el-table-column label="系统" prop="product" />
      <el-table-column label="子系统" prop="subSystem" />
      <el-table-column label="管理流程" prop="managementProcess" />
      <el-table-column
        label="危险源描述"
        prop="hazardSource"
        min-width="300"
        show-overflow-tooltip
      />
      <el-table-column
        label="危险源"
        prop="hazardSources"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column label="ID" prop="hazard" />
      <el-table-column label="可能性" width="110">
        <template slot-scope="{ row }">
          <el-select
            v-model="row.possibility"
            style="width: 100%"
            :disabled="false"
          >
            <!-- code作为key -->
            <el-option
              v-for="item in dictList"
              :key="item.key"
              :label="`${item.value}(${item.name})`"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="严重性" prop="seriousness" />
      <el-table-column
        label="可能导致的风险"
        prop="possibleRisks"
        min-width="140"
      >
        <template slot-scope="{ row }">
          <el-select
            v-model="row.possibleRisks"
            style="width: 120px"
            :disabled="true"
          >
            <el-option
              v-for="childItem in possibleRisksList"
              :key="childItem.riskNo"
              :label="childItem.riskName"
              :value="childItem.riskNo"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="风险等级" prop="riskLevel" />
      <el-table-column label="根原因分析" width="200">
        <template slot-scope="{ row }">
          <el-input v-model="row.rootCauseAnalysis" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="控制措施" min-width="200">
        <template slot-scope="{ row }">
          <el-input
            v-model="row.specialRiskMeasureList[0].controlMeasure"
            placeholder
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="责任单位" width="160">
        <template slot-scope="{ row }">
          <treeselect
            v-loading="loadingTree"
            v-model="row.specialRiskMeasureList[0].reponsibleDept"
            :options="options"
            :normalizer="normalizer"
            :default-expand-level="1"
            :multiple="false"
            :limit="Infinity"
            :flat="false"
            :placeholder="$t('global.select')"
            appendToBody
          />
        </template>
      </el-table-column>
      <el-table-column label="控制状态" width="110">
        <template slot-scope="{ row }">
          <el-select v-model="row.specialRiskMeasureList[0].completion">
            <el-option label="未控制" value="1"></el-option>
            <el-option label="在控" value="2"></el-option>
            <el-option label="关闭" value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit()">{{
        form.type == '2' ? '暂存' : '确认'
      }}</el-button>
      <el-button
        v-if="form.type == '2'"
        type="success"
        @click="submit"
        :loading="loading"
        >提交</el-button
      >
    </div>
    <selectEmplotee ref="selectEmplotee" @on-submit="doSubmit" />
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryDepartmentTree } from '@/api/emplotee'
import { queryDictByName } from '@/api/dict'
import department from '@/components/Department'
import deptByRole from '@/components/Department/deptByRole'
import dictSelect from '@/components/common/dictSelect'
import { specialRiskAdd, specialRiskModify, queryRiskListMgr } from '@/api/risk'
import selectEmplotee from './selectEmplotee'

export default {
  components: {
    department,
    deptByRole,
    dictSelect,
    selectEmplotee,
    Treeselect,
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      loadingTree: false,
      possibleRisksList: [],
      options: [],
      dictList: [],
      form: { type: '1' },
      list: [
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '开航信息、适用机型、考察需求提供不及时、不准确',
          hazardSources: '未按规定传递信息',
          hazard: 'J4-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '前期对当地航站维修资源了解不到位',
          hazardSources: '其他',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '机务考察组织实施不及时',
          hazardSources: '其他',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '航站当地易发生台风和雪霜天气',
          hazardSources: '恶劣天气',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C09',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地机场通用工具设备不足（如：轮档、安全锥',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-02',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C09',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方机务维修工作基本工具不能满足要求',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-02',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方机务维修工作梯不满足要求',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-03',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C09',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方机务维修拖把不满足要求',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-04',
          possibility: '',
          seriousness: '3',
          possibleRisks: 'A02',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方特种车辆不足',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-05',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C09',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方无航材存放条件',
          hazardSources: '不能满足存储要求',
          hazard: 'F1-02',
          possibility: '',
          seriousness: '2',
          possibleRisks: '',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方无法提供机库',
          hazardSources: '不能满足工作要求',
          hazard: 'F1-03',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '航材配备不能及时到位',
          hazardSources: '工作所需器材准备不足',
          hazard: 'J2-03',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '油料配备不能及时到位',
          hazardSources: '工作所需器材准备不足',
          hazard: 'J2-03',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '工具设备配备不能及时到位',
          hazardSources: '工具设备资源不足',
          hazard: 'J2-02',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地无除防冰能力（如适用）',
          hazardSources: '其他',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方没有符合资格要求的勤务、维修、放行人员',
          hazardSources: '人员资质不满足工作要求',
          hazard: 'H1-01',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C13',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方勤务、维修、放行人员人员数量不足',
          hazardSources: '合格的维修人员数量不足',
          hazard: 'J2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方机务人员无或欠缺执飞机型相关维修放行经验',
          hazardSources: '缺少相关工作经验',
          hazard: 'H3-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方维修、放行人员未授权，勤务人员未声明',
          hazardSources: '人员资质不满足工作要求',
          hazard: 'H1-01',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C13',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '人员培训不能及时完成',
          hazardSources: '未按规定开展各类人员培训/复训',
          hazard: 'I2-01',
          possibility: '',
          seriousness: '4',
          possibleRisks: 'C13',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地代理方欠缺相关机务管理程序',
          hazardSources: '其他',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '机务协议未及时签署',
          hazardSources: '其他',
          hazard: 'T2-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地无可用工作单',
          hazardSources: '未按规定分发文件',
          hazard: 'C1-01',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '当地手册不能接近（获取）',
          hazardSources: '相关技术文件准备不足',
          hazard: 'J2-04',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
        {
          product: '维修工程',
          subSystem: '维修计划和控制',
          managementProcess:
            'ESM LM 022 新开航站机务考察和维修资源准备管理程序',
          hazardSource: '航站维修资源需求执行情况未确认',
          hazardSources: '未按规定执行运行支持工作',
          hazard: 'L1-35',
          possibility: '',
          seriousness: '1',
          possibleRisks: 'F01',
          riskLevel: '1',
          rootCauseAnalysis: '',
          specialRiskMeasureList: [
            { controlMeasure: '', reponsibleDept: null, completion: '2' },
          ],
        },
      ],
      spanArr: [
        25,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  watch: {
    'form.type'(val) {
      this.form.issueDepts = null
    },
  },
  created() {
    this.getRiskListMgr()
    this.queryDictByName()

    this.loadingTree = true
    queryDepartmentTree({}).then((res) => {
      this.loadingTree = false
      this.options = res.obj
    })
  },
  methods: {
    deptChange(val, key) {
      this.form[key] = val
    },
    dictChange(val, item, key) {
      item[key] = val
    },
    respChange(val, row) {
      row.specialRiskMeasureList[0].reponsibleDept = val
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit(sqlUserId) {
      this.loading = true
      if (this.isAdd) {
        this.doAdd(sqlUserId)
      } else this.doModify()
    },
    submit() {
      let _this = this.$refs.selectEmplotee
      // _this.id = this.selections[0];
      _this.dialog = true
    },
    doAdd(sqlUserId) {
      let issueDepts = []
      if (this.form.type == '2') {
        submit = sqlUserId ? '1' : '2'
        issueDepts.push(this.form.issueDepts)
      } else {
        issueDepts = this.form.issueDepts
      }
      const params = {
        ...this.form,
        hazardList: this.list,
        assType: '4',
        submit: sqlUserId ? '1' : '2',
        staffno: sqlUserId,
        issueDepts: issueDepts,
      }
      specialRiskAdd(params)
        .then((res) => {
          if (res.code === '200') {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.resetForm()
            this.$parent.init()
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    doModify() {
      const params = { ...this.form, hazardList: this.list }
      specialRiskModify(params)
        .then((res) => {
          if (res.code === '200') {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            this.resetForm()
            this.$parent.init()
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    resetForm() {
      this.dialog = false
    },
    getRiskListMgr() {
      queryRiskListMgr().then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.possibleRisksList = res.obj
        }
      })
    },
    queryDictByName() {
      const type = 'probability_level'
      queryDictByName(type).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.dictList = res.obj[0].children
        }
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.name,
        children: node.children,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 5vh !important;
  .el-dialog__body {
    padding: 20px 20px 10px;
  }
  .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-input--medium .el-input__icon {
    line-height: 30px;
  }
  .vue-treeselect__control {
    height: 30px;
  }
  .el-table--mini td {
    padding: 4px 0;
  }
}
</style>