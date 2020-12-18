<template>
  <div>
    <el-table :data="data.childMeasures" size="mini">
      <el-table-column label="编号" prop="no" />
      <el-table-column label="责任单位" prop="reponsibleDeptName" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="控制措施" prop="controlMeasure" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="落实情况" prop="completion" />
      <el-table-column label="完成期限" prop="deadline" width="100">
        <template slot-scope="{ row }">
          {{
          formatShortDate(row.deadline) || '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <span v-if="row.status == 11">措施待填报</span>
          <span v-if="row.status == 12">措施审核中</span>
          <span v-if="row.status == 13">措施已关闭</span>
          <span v-if="row.status == 14">措施驳回中</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人" width="80">
        <template slot-scope="{ row }">
          <div v-if="row.reviewerInfo == null">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <el-table :data="row.reviewerInfo">
              <el-table-column label="任务名称" prop="taskName"></el-table-column>
              <el-table-column label="分配人" width="135">
                <template slot-scope="{ row }">
                  {{
                  row.name || '-'
                  }}
                </template>
              </el-table-column>
              <el-table-column label="分配时间" width="135">
                <template slot-scope="{ row }">
                  {{
                  formatShortDate(row.createTime) || '-'
                  }}
                </template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="{ row }">
                  {{
                  row.groupName || '-'
                  }}
                </template>
              </el-table-column>
              <el-table-column label="审批人">
                <template slot-scope="{ row }">
                  {{
                  row.users || '-'
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录" width="100">
        <template slot-scope="{ row }">
          <div v-if="row.noteComment == null">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.noteComment" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核" width="160">
        <template slot-scope="{ row }">
          <span v-if="!row.reviewing">-</span>
          <el-button
            v-if="row.reviewing"
            type="warning"
            size="mini"
            @click="doHandle(row)"
            :loading="reviewLoading"
          >办理</el-button>
          <!-- <el-button
                v-if="row.hiddenSubIssue"
                type="primary"
                size="mini"
                @click="doHairdown(row)"
                :loading="reviewLoading"
                >下发</el-button
          >-->
        </template>
      </el-table-column>
      <el-table-column label="下发记录" v-if="showIssueRecord">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="issueRecord(row)" :loading="tbLoading">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <hairdown
      ref="formHairdown"
      :data="data"
      :form="formHairdown"
      :multiple="false"
      :issue="false"
    />
    <handleMeasures ref="handleMeasures" :isSecChild="true" :source="source" />
    <cmdIssue ref="cmdIssue" />
  </div>
</template>

<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
import handleMeasures from "./handleTo4";
import hairdown from './hairdown'
import { specialRiskFill, queryIssueTreeNoteData } from "@/api/risk";
import cmdIssue from './cmdIssueTreeTable'
import { format, formatShortDate } from '@/utils/datetime'
export default {
  components: { leaderApprvalRecord, handleMeasures, cmdIssue, hairdown },
  data() {
    return {
      reviewLoading: false,
      tbLoading: false,
      formHairdown: {}
    }
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
    source: {
      type: String,
      default: ''
    },
    showIssueRecord: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log("childM...", this.source);
  },
  methods: {
    format,
    formatShortDate,
    doHandle(row) {
      this.reviewLoading = true
      specialRiskFill(row.taskId).then((res) => {
        this.reviewLoading = false
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          let _this = this.$refs.handleMeasures
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
    },
    issueRecord(row) {
      this.tbLoading = true;
      const issueType = '1';
      queryIssueTreeNoteData(issueType, row.id).then(res => {
        this.tbLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.cmdIssue;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>