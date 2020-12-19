<template>
  <div>
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{ data.no }}</el-form-item>
        <el-form-item label="截止日期">
          {{ formatShortDate(data.endTime) }}
        </el-form-item>
        <el-form-item label="发布部门">{{ data.releasePathName }}</el-form-item>
        <el-form-item label="下发部门">{{ data.issueDeptName }}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.title }}</el-form-item>
            <el-form-item label="通知内容">{{ data.noteContent }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 系统和工作分析记录表 -->
    <el-card
      header="系统和工作分析记录表"
      v-if="assessmentType == '1' || assessmentType == '2'"
    >
      <el-form size="mini" label-width="80px" :disabled="formEnable">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input
                v-model="data.analysisTitle"
                :disabled="formEnable"
              ></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input :disabled="true" v-model="data.analysisNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析人">
              <el-input
                v-model="data.analysis"
                :disabled="formEnable"
              ></el-input>
            </el-form-item>
            <el-form-item label="批准人">
              <el-input :disabled="true" v-model="data.approval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <department
                :value="data.analysisDept"
                @change="deptAnalysisChange($event, 'analysisDept')"
                :disabled="formEnable"
                :url="deptPath"
                :path="departmentParams"
              ></department>
            </el-form-item>
            <el-form-item label="批准日期">
              <el-date-picker
                v-model="data.approvalDate"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-button
            class="mb-10"
            type="info"
            size="mini"
            icon="el-icon-plus"
            @click="addCol"
            :disabled="formEnable"
            >新增一行</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="data.specialRiskAnalyses" size="mini" max-height="500">
        <el-table-column label="系统" min-width="130">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.product"
              placeholder="请选择系统"
              :disabled="riskEnable"
              clearable
            >
              <el-option label="维修工程" value="维修工程"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="子系统" width="130">
          <template slot-scope="{ row }">
            <dictSelect
              :disabled="riskEnable"
              type="system"
              :value="row.subSystem"
              @change="dictChange($event, row, 'subSystem')"
            />
          </template>
        </el-table-column>
        <el-table-column label="管理流程" min-width="130">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.managementProcess"
              placeholder
              :disabled="riskEnable"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="责任单位" min-width="200">
          <template slot-scope="{ row }">
            <department
              :value="row.reponsibleUnit"
              @change="deptChangeOnTb($event, row)"
              :disabled="riskEnable"
            ></department>
          </template>
        </el-table-column>
        <el-table-column label="岗位" min-width="130">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.post"
              placeholder
              :disabled="riskEnable"
            ></el-input>
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
                :disabled="riskEnable"
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
              @click="delAnalysesCol($index)"
              :disabled="formEnable"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="chead">
      <div slot="header" class="hslot">
        <span>危险源</span>
        <el-button
          v-if="assessmentType != '4'"
          type="text"
          icon="el-icon-tickets"
          @click="showReport"
          :disabled="!data.hiddenReport"
          >风险报告</el-button
        >
      </div>
      <el-form
        size="mini"
        label-width="80px"
        v-if="assessmentType != '1' && assessmentType != '2'"
      >
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input
                :disabled="formEnable"
                v-model="data.analysisTitle"
              ></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input :disabled="true" v-model="data.analysisNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析人">
              <el-input
                :disabled="formEnable"
                v-model="data.analysis"
              ></el-input>
            </el-form-item>
            <el-form-item label="批准人">
              <el-input :disabled="true" v-model="data.approval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <department
                :value="data.analysisDept"
                @change="deptAnalysisChange($event, 'analysisDept')"
                :disabled="formEnable"
                :url="deptPath"
                :path="departmentParams"
              ></department>
            </el-form-item>
            <el-form-item label="批准日期">
              <el-date-picker
                v-model="data.approvalDate"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="assessmentType == '4'">
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
                @change="forceUpdate()"
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
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="风险等级" prop="riskLevel" />
          <el-table-column label="根原因分析" width="200">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.rootCauseAnalysis"
                placeholder
                @input="forceUpdate()"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="控制措施" min-width="210">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-input
                    v-model="item.controlMeasure"
                    placeholder
                  ></el-input>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="责任单位" min-width="380">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <treeselect
                    v-loading="loadingTree"
                    v-model="item.reponsibleDept"
                    :options="options"
                    :normalizer="normalizer"
                    :default-expand-level="1"
                    :multiple="false"
                    :limit="Infinity"
                    :flat="false"
                    :placeholder="$t('global.select')"
                    appendToBody
                  />
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="控制状态" min-width="160">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li
                  v-for="(item, index) in row.specialRiskMeasureList"
                  :key="item.id"
                >
                  <el-select v-model="item.status" style="width: 75%" :disabled="true">
                    <el-option label="措施待填报" value="11"></el-option>
                    <el-option label="措施审核中" value="12"></el-option>
                    <el-option label="措施已关闭" value="13"></el-option>
                    <el-option label="措施已驳回" value="14"></el-option>
                  </el-select>
                  <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="delSpecial(row, item, index)"
                    v-if="
                      item.controlMeasure ||
                      item.reponsibleDept ||
                      item.status
                    "
                  >
                    <i
                      slot="reference"
                      class="el-icon-delete"
                      style="cursor: pointer; margin-right: 10px; color: red"
                    ></i>
                  </el-popconfirm>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-badge :value="data.hazardList.length">
          <el-button
            type="primary"
            size="mini"
            @click="addHazard"
            style="margin-bottom: 10px"
            >新增危险源</el-button
          >
        </el-badge>
        <el-card
          shadow="never"
          v-for="(item, index) in data.hazardList"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span>危险源{{ index + 1 }}</span>
          </div>
          <el-form size="mini" inline label-width="70px" :disabled="formEnable">
            <el-form-item label="系统">
              <el-select
                v-model="item.product"
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
              <el-input
                v-model="item.managementProcess"
                @input="$forceUpdate()"
              ></el-input>
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
                ></el-option>
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
                ></el-option>
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
                    @input="$forceUpdate()"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="根原因分析" label-width="115px">
                  <el-input
                    v-model="item.rootCauseAnalysis"
                    type="textarea"
                    rows="3"
                    @input="$forceUpdate()"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 风险表格 -->
          <el-button
            :disabled="riskEnable"
            type="info"
            size="mini"
            class="at"
            @click="addRow(item)"
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
                <el-input
                  v-model="scope.row.controlMeasure"
                  :disabled="riskEnable"
                  type="textarea"
                  rows="3"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="责任单位">
              <template slot-scope="scope">
                <department
                  :value="scope.row.reponsibleDept"
                  @change="deptChange($event, scope.row, 'reponsibleDept')"
                  :disabled="riskEnable"
                  :path="departmentParams"
                />
              </template>
            </el-table-column>
            <el-table-column label="控制状态" v-if="data.step != 7">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.status"
                  :disabled="completionEnable"
                >
                  <el-option label="未控制" value="1"></el-option>
                  <el-option label="在控" value="2"></el-option>
                  <el-option label="关闭" value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="落实情况" v-else>
              <template slot-scope="scope">
                <el-input v-model="scope.row.completion"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="完成期限">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.deadline"
                  value-format="yyyy-MM-dd"
                  :disabled="riskEnable"
                  :picker-options="pickerOptions"
                  style="max-width: 100%"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot-scope="{ $index }">
                <el-button
                  :disabled="riskEnable"
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delCol($index, item)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="center">
            <el-button
              :disabled="formEnable"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delHazard(index)"
              >删除</el-button
            >
          </div>
        </el-card>
      </div>
    </el-card>

    <report
      ref="report"
      :formId="formId"
      :disabled="true"
      @change="formIdChange"
    />
    <!-- <ehandle ref="ehandle" />
    <hairdown ref="formHairdown" :data="data" :form="formHairdown" :multiple="false" :issue="false" />-->

    <el-card header="已下发通知" key="childNotes" v-if="showChildNotes">
      <childNotes :data="data" :source="source" />
    </el-card>
    <el-card header="已下发措施" key="childMeasures" v-if="showChildMeasures">
      <childMeasures :data="data" :source="source" />
    </el-card>
    <el-card
      header="审批记录"
      key="noticeComments"
      v-if="data.noticeComments && data.noticeComments.length > 0"
    >
      <apprvalRecord :data="data.noticeComments" />
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { formatShortDate } from '@/utils/datetime'
import { deepClone } from '@/utils/index'
import apprvalRecord from '../apprvalRecord'
import childMeasures from '../childMeasures'
import childNotes from '../childNotes'
// import ehandle from '../handleTo4'
// import hairdown from '../hairdown'
import dictSelect from '@/components/common/dictSelect'
import deptByRole from '@/components/Department/deptByRole'
import department from '@/components/Department'
import report from '../report'
// import leaderApprvalRecord from '../leaderApprvalRecord'
import {
  specialRiskSaveHazard,
  specialRiskQueryRiskLevel,
  queryRiskListMgr,
  specialRiskFill,
} from '@/api/risk'
import { queryDictByName } from '@/api/dict'
import { queryHazardList } from '@/api/standard'
import { queryDepts } from '@/api/emplotee'

export default {
  components: {
    Treeselect,
    apprvalRecord,
    childMeasures,
    childNotes,
    report,
    dictSelect,
    deptByRole,
    department,
    // leaderApprvalRecord,
    // ehandle,
    // hairdown,
  },
  data() {
    return {
      options: [],
      dictList: [],
      loadingTree: false,
      formId: '',
      riskLevel1List: [],
      riskLevel2List: [],
      totalhazardList: [], // 全部危险源
      hazardList: [], // 危险源
      possibleRisksList: [], // 可能导致的风险列表
      listArr: [
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
            { controlMeasure: '', reponsibleDept: null, status: '11' },
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
      reviewLoading: false,
      deptPath: '/risk_mgr/special_risk_notice_mgr/query/tree',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      // formHairdown: {},
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    form: {
      type: Object,
      default: () => {},
    },
    assessmentType: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
  },
  computed: {
    type() {
      return this.data.step
    },
    formEnable() {
      return (
        this.data.step == 4 ||
        this.data.step == 5 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
    },
    riskEnable() {
      return (
        this.data.step == 4 ||
        this.data.step == 5 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
    },
    completionEnable() {
      return this.data.step != 7 && this.data.step != 8
    },
    showChildNotes() {
      const bool = !(
        (this.data.step == 1 && this.data.hiddenIssue) ||
        this.data.step == 4 ||
        this.data.step == 2 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
      return bool
    },
    showChildMeasures() {
      return this.data.step == 4 || this.data.step == 5 || this.data.step == 6
    },
    list() {
      let arr = []
      if (this.data.hazardVoList.length == 25) {
        arr = this.listArr.map((item, index) => {
          item.possibility = this.data.hazardVoList[index].possibility
          item.rootCauseAnalysis = this.data.hazardVoList[
            index
          ].rootCauseAnalysis
          item.specialRiskMeasureList = this.data.hazardVoList[
            index
          ].specialRiskMeasureList
          return item
        })
      } else {
        arr = deepClone([...this.listArr])
      }
      return arr
    },
    departmentParams() {
      return this.data.issueDept
    },
  },
  watch: {
    'data.type'(val) {
      this.data.issueDepts = null
    },
  },
  created() {
    // 危险源层级
    queryDictByName('hazard_source').then((response) => {
      this.riskLevel1List = response.obj[0].children
    })
    // 危险源
    queryHazardList().then((res) => {
      this.totalhazardList = res.obj
      this.hazardList = this.totalhazardList
    })
    queryRiskListMgr().then((res) => {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        this.possibleRisksList = res.obj
      }
    })

    this.loadingTree = true
    const url = '/sys_mgr/department_mgr/query/tree'
    queryDepts(url).then((res) => {
      this.loadingTree = false
      this.options = res.obj
    })
    queryDictByName('probability_level').then((res) => {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        this.dictList = res.obj[0].children
      }
    })
  },
  mounted() {
    console.log('step1', this.source)
  },
  methods: {
    formatShortDate,
    showReport() {
      this.formId = this.data.id
      this.$refs.report.dialog = true
    },
    formIdChange(val) {
      this.formId = val
    },
    addCol() {
      this.data.specialRiskAnalyses.push({
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
    delAnalysesCol(index) {
      this.data.specialRiskAnalyses.splice(index, 1)
    },
    addHazard() {
      this.data.hazardList.push({
        riskLevel1: this.riskLevel1List[0] ? this.riskLevel1List[0].value : '', //危险源层级1
        riskLevel2: this.riskLevel2List[0] ? this.riskLevel2List[0].value : '', //危险源层级2
        hazard: this.hazardList[0] ? this.hazardList[0].diskNo : '',
        hazardSource: '',
        managementProcess: '',
        possibility: '1',
        possibleRisks: this.possibleRisksList[0]
          ? this.possibleRisksList[0].riskNo
          : '',
        riskLevel: '1',
        rootCauseAnalysis: '',
        seriousness: '1',
        specialRiskMeasureList: [
          {
            status: '11',
            controlMeasure: '',
            deadline: '',
            reponsibleDept: null,
          },
        ],
        subSystem: '',
        product: '维修工程',
      })
      this.data.hazardList[
        this.data.hazardList.length - 1
      ].riskLevel1 = this.riskLevel1List[0].value
      this.chooseRiskLevel1(
        this.data.hazardList[this.data.hazardList.length - 1].riskLevel1,
        this.data.hazardList[this.data.hazardList.length - 1]
      )
      this.$forceUpdate()
    },
    delHazard(index) {
      this.data.hazardList.splice(index, 1)
      this.$forceUpdate()
    },
    addRow(item) {
      item.specialRiskMeasureList.push({
        status: '11',
        controlMeasure: '',
        deadline: '',
        reponsibleDept: null,
      })
    },
    delCol(index, item) {
      item.specialRiskMeasureList.splice(index, 1)
      this.$forceUpdate()
    },
    dictChange(val, item, key) {
      item[key] = val
      if (key == 'possibility' || key == 'seriousness') {
        this.queryRiskLevel(item.possibility, item.seriousness, item)
      }
      this.$forceUpdate()
      /* if (key == 'hazard' || key == 'possibleRisks') {
        this.queryRiskLevel(item.hazard, item.possibleRisks, item);
      } */
    },
    deptChange(val, row, key) {
      row[key] = val
      this.$forceUpdate()
    },
    deptAnalysisChange(val, key) {
      this.data[key] = val
      this.$forceUpdate()
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val
      this.$forceUpdate()
    },
    ideUnitChange(val) {
      this.data.identificationUnit = val
      this.$forceUpdate()
    },
    /**查询风险 */
    queryRiskLevel(hazard, risk, item) {
      if (!!hazard && !!risk) {
        specialRiskQueryRiskLevel(hazard, risk).then((res) => {
          if (res.code == '200') {
            /* item.possibility = res.obj.possibility;
            item.seriousness = res.obj.seriousness; */
            item.riskLevel = `${res.obj}`
            this.$forceUpdate()
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
      this.$forceUpdate()
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
    delSpecial(row, item, index) {
      if (row.specialRiskMeasureList.length > 1) {
        row.specialRiskMeasureList.splice(index, 1)
      } else if (row.specialRiskMeasureList.length == 1) {
        row.specialRiskMeasureList[0].controlMeasure = ''
        row.specialRiskMeasureList[0].reponsibleDept = null
        row.specialRiskMeasureList[0].status = '11'
      }
    },
    forceUpdate() {
      this.data.hazardList = this.list
      this.$forceUpdate()
    },
    /* doHandle(row) {
      this.reviewLoading = true
      specialRiskFill(row.taskId).then((res) => {
        this.reviewLoading = false
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          let _this = this.$refs.ehandle
          _this.parentTaskId = row.parentTaskId
          _this.data = res.obj
          _this.data.approvalDate = formatShortDate(res.obj.approvalDate)
          if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
            _this.data.hazardList = res.obj.hazardVoList.map((item) => {
              item.specialRiskMeasureList.map((childItem) => {
                childItem.deadline = formatShortDate(childItem.deadline)
              })
              return item
            })
          } else {
            _this.data.hazardList = []
          }
          _this.form.taskId = row.taskId
          _this.form.formId = res.obj.id
          _this.dialog = true
        }
      })
    },
    doHairdown(row) {
      this.formHairdown.formId = row.id
      this.formHairdown.taskId = row.parentTaskId
      this.formHairdown.pathAndDeadLines = []
      this.$refs.formHairdown.dialog = true;
    } */
  },
}
</script>

<style lang="scss" scoped>
.info {
  /deep/ .el-form-item__content {
    min-width: 200px;
  }
}
.info2 {
  /deep/ .el-form-item__content {
    min-width: 140px;
  }
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
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
  margin: 0;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /deep/ .vue-treeselect__control {
    display: block;
  }
  /deep/ .vue-treeselect__input-container {
    padding-top: 5px;
  }
}
.chead {
  /deep/ .el-card__header {
    padding: 5px 20px;
  }
  .hslot {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>