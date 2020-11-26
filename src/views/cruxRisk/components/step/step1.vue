<template>
  <div>
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{data.no}}</el-form-item>
        <el-form-item label="截止日期">{{formatShortDate(data.endTime)}}</el-form-item>
        <el-form-item label="下发部门">{{data.issueDeptName}}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{data.title}}</el-form-item>
            <el-form-item label="通知内容">{{data.noteContent}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 系统和工作分析记录表 -->
    <el-card header="系统和工作分析记录表" key="specialRiskAnalyses">
      <el-form size="mini" class="info2" inline>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{data.analysisTitle}}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="编号">{{data.analysisNo}}</el-form-item>
        <el-form-item label="分析人">{{data.analysisName}}</el-form-item>
        <el-form-item label="分析单位">{{data.analysisDeptName}}</el-form-item>
        <el-form-item label="批准">{{data.approval}}</el-form-item>
        <el-form-item label="批准日期">{{formatShortDate(data.approvalDate)}}</el-form-item>
        <el-table :data="data.specialRiskAnalyses" size="mini" max-height="500">
          <el-table-column label="系统" prop="systemName" />
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
    <el-card class="chead">
      <div slot="header" class="hslot">
        <span>危险源</span>
        <el-button type="text" icon="el-icon-tickets" @click="showReport">风险报告</el-button>
      </div>
      <el-table :data="data.hazardVoList" size="mini">
        <el-table-column label="系统" prop="systemName" />
        <el-table-column label="子系统" prop="subSystemName" />
        <el-table-column label="可能性" prop="possibilityName" />
        <el-table-column label="严重性" prop="seriousnessName" />
        <el-table-column label="风险等级" prop="riskLevelName" />
        <el-table-column label="管理流程" prop="managementProcess" />
        <el-table-column label="问题描述" prop="hazardSource" />
        <el-table-column label="根原因分析" prop="rootCauseAnalysis" width="140" show-overflow-tooltip />
        <el-table-column label="可能导致的风险" prop="possibleRisks" width="160" show-overflow-tooltip />
        <el-table-column label="风险控制措施" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">{{item.controlMeasure}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险责任单位" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li
                v-for="item in row.specialRiskMeasureList"
                :key="item.id"
              >{{item.reponsibleDeptName}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险控制状态" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">{{item.completionName}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险完成期限" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li
                v-for="item in row.specialRiskMeasureList"
                :key="item.id"
              >{{formatShortDate(item.deadline)}}</li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card
      header="审批记录"
      key="noticeComments"
      v-if="data.noticeComments&&data.noticeComments.length>0"
    >
      <apprvalRecord :data="data.noticeComments" />
    </el-card>
    <report ref="report" :formId="formId" :disabled="true" @change="formIdChange" />
  </div>
</template>

<script>
import { formatShortDate } from "@/utils/datetime";
import apprvalRecord from "../apprvalRecord";
import report from "../report";

export default {
  components: { apprvalRecord, report },
  data() {
    return {
      formId: "",
    };
  },
  props: ["data", "form"],
  methods: {
    formatShortDate,
    showReport() {
      this.formId = this.data.id;
      this.$refs.report.dialog = true;
    },
    formIdChange(val) {
      this.formId = val;
    },
  },
};
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