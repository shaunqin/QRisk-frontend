<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
    v-loading="dialogLoading"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{ data.no }}</el-form-item>
        <el-form-item label="截止日期">
          {{
          formatShortDate(data.endTime)
          }}
        </el-form-item>
        <el-form-item label="发布部门">{{ data.releasePathName }}</el-form-item>
        <el-form-item label="下发部门">{{ data.issueDeptName }}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.title }}</el-form-item>
            <el-form-item label="通知内容" v-if="data.type!='2'">{{ data.noteContent }}</el-form-item>
            <el-form-item label="附件">
              <span v-for="(item, index) in data.file" :key="index">
                <el-link
                  type="primary"
                  v-show="item != null"
                  :href="getUrl(item ? item.filePath : '')"
                  target="_blank"
                >{{ item ? item.originFileName : '' }}</el-link>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 系统和工作分析记录表 -->
    <el-card class="chead" key="specialRiskAnalyses" v-if="data.assType == 1 || data.assType == 2">
      <div slot="header" class="hslot">
        <span>系统和工作分析记录表</span>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="doExport(1)">导出</el-button>
      </div>
      <el-form size="mini" class="info2" inline>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.analysisTitle }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="编号">{{ data.analysisNo }}</el-form-item>
        <el-form-item label="分析人">{{ data.analysis }}</el-form-item>
        <el-form-item label="分析单位">
          {{
          data.analysisDeptName
          }}
        </el-form-item>
        <el-form-item label="批准人">{{ data.approval }}</el-form-item>
        <el-form-item label="批准日期">
          {{
          formatShortDate(data.approvalDate)
          }}
        </el-form-item>
        <el-table :data="data.specialRiskAnalyses" size="mini" max-height="500">
          <el-table-column label="系统" prop="productName" />
          <el-table-column label="子系统" prop="subSystemName" />
          <el-table-column label="管理流程" prop="managementProcess" />
          <el-table-column label="责任单位" prop="reponsibleUnitName" />
          <el-table-column label="岗位" prop="post" />
          <el-table-column label="流程要素">
            <el-table-column label="人" prop="processHuman" />
            <el-table-column label="机" prop="processMachine" />
            <el-table-column label="料" prop="processMaterial" />
            <el-table-column label="法" prop="processRegulation" />
            <el-table-column label="环" prop="processEnvironment" />
          </el-table-column>
          <el-table-column label="流程分析">
            <el-table-column label="输入" prop="input" />
            <el-table-column label="输出" prop="output" />
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <!-- 危险源 -->
    <el-card key="hazardVoList" class="chead">
      <div slot="header" class="hslot">
        <span>危险源</span>
        <div>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-tickets"
            @click="showReport"
            :disabled="!data.hiddenReport"
          >风险报告</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download" @click="doExport(2)">导出</el-button>
        </div>
      </div>
      <el-form size="mini" class="info2" inline v-if="data.assType != 1 && data.assType != 2">
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.analysisTitle }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="编号">{{ data.analysisNo }}</el-form-item>
        <el-form-item label="分析人">{{ data.analysis }}</el-form-item>
        <el-form-item label="分析单位">
          {{
          data.analysisDeptName
          }}
        </el-form-item>
        <el-form-item label="批准人">{{ data.approval }}</el-form-item>
        <el-form-item label="批准日期">
          {{
          formatShortDate(data.approvalDate)
          }}
        </el-form-item>
      </el-form>

      <div v-if="assessmentType == '4'">
        <el-table
          :data="list"
          size="mini"
          :span-method="objectSpanMethod"
          border
          max-height="550"
          key="list"
        >
          <el-table-column label="系统" prop="product" />
          <el-table-column label="子系统" prop="subSystem" />
          <el-table-column label="管理流程" prop="managementProcess" />
          <el-table-column label="危险源描述" prop="hazardSource" min-width="300" show-overflow-tooltip />
          <el-table-column label="危险源" prop="hazardSources" min-width="200" show-overflow-tooltip />
          <el-table-column label="ID" prop="hazard" />
          <el-table-column label="可能性" width="110" prop="possibility"></el-table-column>
          <el-table-column label="严重性" prop="seriousness" />
          <el-table-column label="可能导致的风险" prop="possibleRisks" min-width="140"></el-table-column>
          <el-table-column label="风险等级" prop="riskLevel" />
          <el-table-column label="根原因分析" width="200" prop="rootCauseAnalysis"></el-table-column>
          <el-table-column label="控制措施" min-width="200">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.controlMeasure}}</span>
                    <div class="text" slot="reference">{{item.controlMeasure}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="落实情况" min-width="200" v-if="completionEnable">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.completion}}</span>
                    <div class="text" slot="reference">{{item.completion}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="责任单位" width="160">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.reponsibleDeptName}}</span>
                    <div class="text" slot="reference">{{item.reponsibleDeptName}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="控制状态" width="150">
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <span v-if="item.measureStatus=='0'">不适用</span>
                  <span v-if="item.measureStatus=='1'">未控制</span>
                  <span v-if="item.measureStatus=='2'">在控</span>
                  <span v-if="item.measureStatus=='3'">关闭</span>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table :data="data.hazardVoList" size="mini" key="hazardVoList">
          <el-table-column label="系统" prop="productName" />
          <el-table-column label="子系统" prop="subSystemName" />
          <el-table-column label="可能性" prop="possibilityName" />
          <el-table-column label="严重性" prop="seriousnessName" />
          <el-table-column label="风险等级" prop="riskLevelName" />
          <el-table-column label="管理流程" prop="managementProcess" />
          <el-table-column label="问题描述" prop="hazardSource" />
          <el-table-column
            label="根原因分析"
            prop="rootCauseAnalysis"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            label="可能导致的风险"
            prop="possibleRisksName"
            width="160"
            show-overflow-tooltip
          />
          <el-table-column label="风险控制措施" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.controlMeasure}}</span>
                    <div class="text" slot="reference">{{item.controlMeasure}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="风险责任单位" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.reponsibleDeptName}}</span>
                    <div class="text" slot="reference">{{item.reponsibleDeptName}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="落实情况" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{item.completion}}</span>
                    <div class="text" slot="reference">{{item.completion}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="风险控制状态" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <span v-if="item.measureStatus=='0'">不适用</span>
                  <span v-if="item.measureStatus=='1'">未控制</span>
                  <span v-if="item.measureStatus=='2'">在控</span>
                  <span v-if="item.measureStatus=='3'">关闭</span>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="风险完成期限" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{formatShortDate(item.deadline)}}</span>
                    <div class="text" slot="reference">{{formatShortDate(item.deadline)}}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card
      header="办理人"
      key="reviewerInfo"
      v-if="data.reviewerInfo && data.reviewerInfo.length > 0"
    >
      <transactor :data="data.reviewerInfo" width="100%" />
    </el-card>
    <el-card header="下发记录" key="childNotes" v-if="showChildNotes">
      <childNotes :data="data" :showIssueRecord="true" :hiddenField="['审核']" />
    </el-card>
    <el-card header="下发措施" key="firstLevelMeasure" v-if="completionEnable">
      <childMeasures :data="data" :showIssueRecord="true" :hiddenField="['审核']" />
    </el-card>

    <el-card
      header="审批记录"
      key="noticeComments"
      v-if="data.noticeComments && data.noticeComments.length > 0"
    >
      <apprvalRecord :data="data.noticeComments" />
    </el-card>

    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>

    <report ref="report" :formId="formId" :disabled="true" @change="formIdChange" />
  </el-dialog>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import apprvalRecord from './apprvalRecord'
import childMeasures from './childMeasures'
import childNotes from './childNotes'
import report from './report'
import transactor from '@/components/common/transactor'
import { exportSystenreportAndRisksource } from '@/api/risk'
export default {
  components: { apprvalRecord, report, transactor, childMeasures, childNotes },
  props: {
    showChildNotes: {
      type: Boolean,
      default: true,
    },
    showChildMeasures: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formId: '',
      dialog: false,
      dialogLoading: false,
      data: {},
      assessmentType: '',
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
            { controlMeasure: '', reponsibleDept: null, measureStatus: '2' },
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
      completionEnable: false
    }
  },
  methods: {
    formatShortDate,
    showReport() {
      this.formId = this.data.id
      this.$refs.report.disabled = true
      this.$refs.report.dialog = true
    },
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url
    },
    formIdChange(val) {
      this.formId = val
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
    doExport(type) {
      this.$loading();
      exportSystenreportAndRisksource(this.data.id, type).then(res => {
        this.$loading().close();
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let url = process.env.VUE_APP_BASE_API + res.obj;
          let a = document.createElement('a');
          a.href = url;
          a.target = "_blank";
          a.click();
        }
      })
    }
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