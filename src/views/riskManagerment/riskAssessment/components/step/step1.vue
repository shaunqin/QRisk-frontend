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
          <el-table-column label="系统" prop="system" />
          <el-table-column label="子系统" prop="subSystem" />
          <el-table-column label="管理流程" prop="managementProcess" />
          <el-table-column label="责任单位" prop="reponsibleUnit" />
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
    <el-card header="危险源">
      <el-table :data="data.hazardVoList" size="mini">
        <el-table-column label="系统" prop="system" />
        <el-table-column label="子系统" prop="subSystem" />
        <el-table-column label="可能性" prop="possibility" />
        <el-table-column label="严重性" prop="seriousness" />
        <el-table-column label="风险等级" prop="riskLevel" />
        <el-table-column label="控制措施" prop="controlMeasure" />
        <el-table-column label="控制状态" prop="controlState" />
        <el-table-column label="完成期限" width="100">
          <template slot-scope="{row}">{{formatShortDate(row.deadline)}}</template>
        </el-table-column>
        <el-table-column label="管理流程" prop="managementProcess" />
        <el-table-column label="问题描述" prop="hazardSource" />
        <el-table-column label="根原因分析" prop="rootCauseAnalysis" width="140" show-overflow-tooltip />
        <el-table-column label="责任单位" prop="responsibleUnit" />
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
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">{{item.reponsibleDept}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险控制状态" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">{{item.completion}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险完成期限" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">{{item.deadline}}</li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card>
      <el-radio-group v-model="form.processFlag">
        <el-radio label="1">同意</el-radio>
        <el-radio label="2">驳回</el-radio>
      </el-radio-group>
      <el-input
        v-model="form.comment"
        type="textarea"
        rows="3"
        placeholder="请输入备注"
        style="margin-top:10px"
      ></el-input>
    </el-card>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
export default {
  props: ["data", "form"],
  methods: {
    formatShortDate,
  }
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
</style>