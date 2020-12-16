<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="form.endTime"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通知内容">
            <el-input
              v-model="form.noteContent"
              style="width: 100%"
              type="textarea"
              rows="4"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
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
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件">
            <eupload @success="success"></eupload>
            <span v-for="(item, index) in form.file" :key="index">
              <el-link
                type="primary"
                v-show="item != null"
                :href="getUrl(item ? item.filePath : '')"
                target="_blank"
                >{{ item ? item.originFileName : '' }}</el-link
              >
              <el-popconfirm title="确定删除该附件吗？" @onConfirm="del(item)">
                <i
                  class="el-icon-delete"
                  style="cursor: pointer; margin-right: 10px"
                  slot="reference"
                ></i>
              </el-popconfirm>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isAdd">
          <el-form-item label="类型">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              :disabled="assessmentType == '1' || assessmentType == '3'"
            >
              <el-option label="通知" value="1"></el-option>
              <el-option label="评估" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 系统和工作分析记录表 -->
      <el-card
        header="系统和工作分析记录表"
        key="1"
        v-if="
          (form.type == 2 &&
            (assessmentType == '1' || assessmentType == '2')) ||
          (!isAdd && (assessmentType == '1' || assessmentType == '2'))
        "
      >
        <el-row>
          <el-col :span="24">
            <el-button
              class="mb-10"
              type="info"
              size="mini"
              icon="el-icon-plus"
              @click="addCol"
              >新增一行</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="form.specialRiskAnalyses" size="mini" max-height="500">
          <el-table-column label="系统" min-width="130">
            <template slot-scope="{ row }">
              <el-select
                v-model="row.product"
                placeholder="请选择系统"
                clearable
              >
                <el-option label="维修工程" value="维修工程"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="子系统" width="130">
            <template slot-scope="{ row }">
              <dictSelect
                type="system"
                :value="row.subSystem"
                @change="dictChange($event, row, 'subSystem')"
              />
            </template>
          </el-table-column>
          <el-table-column label="管理流程" min-width="130">
            <template slot-scope="{ row }">
              <el-input v-model="row.managementProcess" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="责任单位" min-width="200">
            <template slot-scope="{ row }">
              <department
                :value="row.reponsibleUnit"
                @change="deptChangeOnTb($event, row)"
              ></department>
            </template>
          </el-table-column>
          <el-table-column label="岗位" min-width="130">
            <template slot-scope="{ row }">
              <el-input v-model="row.post" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="流程要素">
            <el-table-column label="人" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.processHuman"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="机" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.processMachine"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.processMaterial"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="法" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.processRegulation"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="环" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.processEnvironment"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="流程分析">
            <el-table-column label="输入" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.input"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="输出" min-width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.output"
                  type="textarea"
                  rows="1"
                  placeholder
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label fixed="right" width="80">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="delCol($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 危险源清单 -->
      <el-card
        header="危险源"
        key="2"
        style="margin-top: 20px"
        v-if="form.type == '2' || !isAdd"
      >
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="form.analysisTitle"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input :disabled="true" v-model="form.analysisNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析人">
              <el-input v-model="form.analysis"></el-input>
            </el-form-item>
            <el-form-item label="批准人">
              <el-input :disabled="true" v-model="form.approval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <department
                :value="form.analysisDept"
                @change="deptChange($event, 'analysisDept')"
              ></department>
            </el-form-item>
            <el-form-item label="批准日期">
              <el-date-picker
                v-model="form.approvalDate"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :disabled="true"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          size="mini"
          @click="addHazard"
          style="margin-bottom: 10px"
          >新增危险源</el-button
        >
        <el-card
          shadow="never"
          v-for="(item, index) in form.hazardList"
          :key="index"
        >
          <el-form size="mini" inline label-width="70px">
            <el-form-item label="系统">
              <el-select
                v-model="item.product"
                style="width: 130px"
                placeholder="请选择系统"
                clearable
              >
                <el-option label="维修工程" value="维修工程"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子系统">
              <dict-select
                :value="item.subSystem"
                type="system"
                @change="dictChange($event, item, 'subSystem')"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="管理流程">
              <el-input v-model="item.managementProcess"></el-input>
            </el-form-item>
            <el-form-item label="危险源层级一" label-width="115px">
              <el-select
                clearable
                v-model="item.riskLevel1"
                placeholder="请选择层级一"
                style="width: 130px"
                @change="chooseRiskLevel1(item.riskLevel1, item)"
              >
                <el-option
                  v-for="item in riskLevel1List"
                  :key="item.key"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="危险源层级二" label-width="115px">
              <el-select
                clearable
                v-model="item.riskLevel2"
                placeholder="请选择层级二"
                style="width: 130px"
                @change="chooseRiskLevel2(item.riskLevel2, item)"
              >
                <el-option
                  v-for="item in riskLevel2List"
                  :key="item.key"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="危险源">
              <el-select
                v-model="item.hazard"
                placeholder="请选择危险源"
                style="width: 130px"
                @change="dictChange(item.hazard, item, 'hazard')"
              >
                <el-option
                  v-for="childItem in hazardList"
                  :key="childItem.diskNo"
                  :label="childItem.diskName"
                  :value="childItem.diskNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可能导致的风险" label-width="115px">
              <el-select
                v-model="item.possibleRisks"
                clearable
                placeholder="请选择可能导致的风险"
                style="width: 130px"
                @change="dictChange(item.possibleRisks, item, 'possibleRisks')"
              >
                <el-option
                  v-for="childItem in possibleRisksList"
                  :key="childItem.riskNo"
                  :label="childItem.riskName"
                  :value="childItem.riskNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可能性">
              <dict-select
                :clearable="false"
                :value="item.possibility"
                type="probability_level"
                @change="dictChange($event, item, 'possibility')"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="严重性">
              <dict-select
                :clearable="false"
                :value="item.seriousness"
                type="severity_level_matrix_graph"
                @change="dictChange($event, item, 'seriousness')"
              />
            </el-form-item>
            <el-form-item label="风险等级">
              <dict-select
                :value="item.riskLevel"
                type="risk_level"
                @change="dictChange($event, item, 'riskLevel')"
                style="width: 130px"
                :disabled="true"
              />
            </el-form-item>
            <el-row :gutter="16" class="fill-row">
              <el-col :span="12">
                <el-form-item label="危险源描述" label-width="115px">
                  <el-input
                    v-model="item.hazardSource"
                    type="textarea"
                    rows="3"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="根原因分析" label-width="115px">
                  <el-input
                    v-model="item.rootCauseAnalysis"
                    type="textarea"
                    rows="3"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 风险表格 -->
          <el-button type="info" size="mini" class="at" @click="addSrmRow(item)"
            >新增一行</el-button
          >
          <el-table
            :data="item.specialRiskMeasureList"
            size="small"
            max-height="400px"
          >
            <el-table-column type="index" width="50" />
            <el-table-column label="控制措施">
              <template slot-scope="scope">
                <el-input v-model="scope.row.controlMeasure"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="责任单位">
              <template slot-scope="scope">
                <department
                  :value="scope.row.reponsibleDept"
                  @change="srmDeptChange($event, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="完成期限">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.deadline"
                  value-format="yyyy-MM-dd"
                  style="max-width: 100%"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot-scope="{ $index }">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delSrmRow($index, item)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="center">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delHazard(index)"
              >删除</el-button
            >
          </div>
        </el-card>
      </el-card>
    </el-form>

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
import { delUpload } from '@/api/upload'
import {
  specialRiskAdd,
  specialRiskModify,
  specialRiskQueryRiskLevel,
} from '@/api/risk'
import { queryDictByName } from '@/api/dict'
import { queryHazardList } from '@/api/standard'
import department from '@/components/Department/index'
import deptByRole from '@/components/Department/deptByRole'
import dictSelect from '@/components/common/dictSelect'
import eupload from '@/components/Upload/index'
import selectEmplotee from './selectEmplotee'

export default {
  components: { department, deptByRole, dictSelect, eupload, selectEmplotee },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        title: '', // 标题
        endTime: '', // 截止日期
        noteContent: '', // 通知内容
        issueDepts: null, // 下发部门
        identificationUnit: null, // 识别单位
        assType: '', // 评估类别
        analysisTitle: '', // 分析标题
        analysisNo: '', // 分析编号
        analysisDept: null, // 分析单位
        analysis: '', // 分析人
        approval: '', // 批准
        approvalDate: '', // 批准日期
        type: '1', // 类别,1:通知,2:评估
        specialRiskAnalyses: [
          {
            product: '', // 产品
            subSystem: '', // 子系统
            managementProcess: '', // 管理流程
            reponsibleUnit: null, // 责任单位
            post: '', // 岗位
            processHuman: '', // 人
            processMachine: '', // 机
            processMaterial: '', // 料
            processRegulation: '', // 法
            processEnvironment: '', // 环
            input: '', // 输入
            output: '', // 输出
          },
        ],
        hazardList: [
          // 危险源
          {
            hazardSource: '',
            managementProcess: '',
            riskLevel1: '', //危险源层级1
            riskLevel2: '', //危险源层级2
            hazard: '', // 危险源
            possibility: '1',
            possibleRisks: '', // 可能导致的风险
            riskLevel: '1',
            rootCauseAnalysis: '',
            seriousness: '1',
            specialRiskMeasureList: [
              {
                completion: '',
                controlMeasure: '',
                deadline: '',
                reponsibleDept: null,
              },
            ],
            subSystem: '',
            product: '',
          },
        ],
        file: [],
      },
      riskLevel1List: [],
      riskLevel2List: [],
      totalhazardList: [], // 全部危险源
      hazardList: [], // 危险源
      possibleRisksList: [], // 可能导致的风险列表
      formRules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      },
      assessmentType: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    'form.type'(val) {
      this.form.issueDepts = null
    },
  },
  created() {
    // 危险源
    queryHazardList().then((res) => {
      this.totalhazardList = res.obj
      // 危险源层级
      queryDictByName('hazard_source').then((response) => {
        this.riskLevel1List = response.obj[0].children
        this.form.hazardList[0].riskLevel1 = this.riskLevel1List[0].value
        this.chooseRiskLevel1(
          this.form.hazardList[0].riskLevel1,
          this.form.hazardList[0]
        )
      })
    })
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit(sqlUserId) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd(sqlUserId)
          } else this.doModify()
        }
      })
    },
    submit() {
      let _this = this.$refs.selectEmplotee
      // _this.id = this.selections[0];
      _this.dialog = true
    },
    doAdd(sqlUserId) {
      let submit
      let issueDepts = []
      if (this.form.type == '2') {
        submit = sqlUserId ? '1' : '2'
        issueDepts.push(this.form.issueDepts)
      } else {
        issueDepts = this.form.issueDepts
      }
      specialRiskAdd({
        ...this.form,
        submit: submit,
        staffno: sqlUserId,
        issueDepts: issueDepts,
      })
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
      specialRiskModify(this.form)
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
      this.$refs['form'].resetFields()
      this.form = {
        title: '', // 标题
        endTime: '', // 截止日期
        noteContent: '', // 通知内容
        issueDepts: null, // 下发部门
        assType: '', // 评估类别
        analysisTitle: '', // 分析标题
        analysisNo: '', // 分析编号
        analysisDept: null, // 分析单位
        analysis: '', // 分析人
        approval: '', // 批准
        approvalDate: '', // 批准日期
        type: '1', // 类别,1:通知,2:评估
        specialRiskAnalyses: [
          {
            product: '', // 产品
            subSystem: '', // 子系统
            managementProcess: '', // 管理流程
            reponsibleUnit: null, // 责任单位
            post: '', // 岗位
            processHuman: '', // 人
            processMachine: '', // 机
            processMaterial: '', // 料
            processRegulation: '', // 法
            processEnvironment: '', // 环
            input: '', // 输入
            output: '', // 输出
          },
        ],
        hazardList: [
          {
            hazardSource: '',
            managementProcess: '',
            hazard: '', // 危险源
            riskLevel1: '', //危险源层级1
            riskLevel2: '', //危险源层级2
            possibility: '1',
            possibleRisks: '', // 可能导致的风险
            riskLevel: '1',
            rootCauseAnalysis: '',
            seriousness: '1',
            specialRiskMeasureList: [
              {
                completion: '',
                controlMeasure: '',
                deadline: '',
                reponsibleDept: null,
              },
            ],
            subSystem: '',
            product: '',
          },
        ],
        file: [],
      }
    },
    deptChange(val, key) {
      this.form[key] = val
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val
    },
    addCol() {
      this.form.specialRiskAnalyses.push({
        product: '', // 产品
        subSystem: '', // 子系统
        managementProcess: '', // 管理流程
        reponsibleUnit: null, // 责任单位
        post: '', // 岗位
        processHuman: '', // 人
        processMachine: '', // 机
        processMaterial: '', // 料
        processRegulation: '', // 法
        processEnvironment: '', // 环
        input: '', // 输入
        output: '', // 输出
      })
    },
    delCol(index) {
      this.form.specialRiskAnalyses.splice(index, 1)
    },
    dictChange(val, item, key) {
      item[key] = val
      if (key == 'possibility' || key == 'seriousness') {
        this.queryRiskLevel(item.possibility, item.seriousness, item)
      }
      /* if (key == 'hazard' || key == 'possibleRisks') {
        this.queryRiskLevel(item.hazard, item.possibleRisks, item);
      } */
    },
    addHazard() {
      this.form.hazardList.push({
        hazardSource: '',
        riskLevel1: this.riskLevel1List[0] ? this.riskLevel1List[0].value : '', //危险源层级1
        riskLevel2: this.riskLevel2List[0] ? this.riskLevel2List[0].value : '', //危险源层级2
        hazard: this.hazardList[0] ? this.hazardList[0].diskNo : '',
        managementProcess: '',
        possibility: '1',
        possibleRisks: this.possibleRisksList[0].riskNo,
        riskLevel: '1',
        rootCauseAnalysis: '',
        seriousness: '1',
        specialRiskMeasureList: [
          {
            completion: '',
            controlMeasure: '',
            deadline: '',
            reponsibleDept: null,
          },
        ],
        subSystem: '',
        product: '',
      })
    },
    delHazard(index) {
      this.form.hazardList.splice(index, 1)
    },
    addSrmRow(item) {
      item.specialRiskMeasureList.push({
        completion: '',
        controlMeasure: '',
        deadline: '',
        reponsibleDept: null,
      })
    },
    delSrmRow(index, item) {
      item.specialRiskMeasureList.splice(index, 1)
    },
    srmDeptChange(val, row) {
      row.reponsibleDept = val
    },
    /**查询风险 */
    queryRiskLevel(hazard, risk, item) {
      if (!!hazard && !!risk) {
        specialRiskQueryRiskLevel(hazard, risk).then((res) => {
          if (res.code == '200') {
            /* item.possibility = res.obj.possibility;
            item.seriousness = res.obj.seriousness; */
            item.riskLevel = `${res.obj}`
          }
        })
      }
    },
    chooseRiskLevel1(val, item) {
      if (this.riskLevel1List.length > 0) {
        let list = this.riskLevel1List.filter((r) => r.value == val)
        if (list && list.length > 0) {
          this.riskLevel2List = list[0].children
        }
        item.riskLevel2 = this.riskLevel2List[0].value
        this.chooseRiskLevel2(item.riskLevel2, item)
      }
    },
    chooseRiskLevel2(val, item) {
      let list = this.totalhazardList.filter((r) => r.cateValue == val)
      if (list && list.length > 0) {
        this.hazardList = list
      }
      item.hazard = this.hazardList[0] ? this.hazardList[0].diskNo : ''
    },
    success(res) {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        this.form.file = this.form.file ? this.form.file : []
        this.form.file.push(res.obj)
      }
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url
    },
    del(item) {
      delUpload(item.id).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$message.success('删除成功！')
          this.form.file.splice(
            this.form.file.indexOf(
              this.form.file.find(function (element) {
                return element.id === item.id
              })
            ),
            1
          )
        }
      })
    },
  },
}
</script>


<style lang="scss" scope>
.mb-10 {
  margin-bottom: 10px;
}

.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
.el-card + .el-card {
  margin-top: 20px;
}
.center {
  margin-top: 8px;
  text-align: center;
}
.at {
  margin-bottom: 8px;
}
</style>
