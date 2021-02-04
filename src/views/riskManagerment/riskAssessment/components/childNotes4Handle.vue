<template>
  <div>
    <el-table :data="data.childNotes" size="mini">
      <el-table-column label="下发部门" prop="issueDeptName" width="140" align="left" />
      <el-table-column label="截止日期" prop="endTime" />
      <!-- <el-table-column label="通知内容" prop="noteContent" min-width="100" /> -->
      <el-table-column label="下发人" prop="creater" />
      <el-table-column label="填报人" prop="reporter" />
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">待处理</span>
          <span v-if="row.status == 1">提交已下发</span>
          <span v-if="row.status == 2">填报待审批</span>
          <span v-if="row.status == 3">驳回修改</span>
          <span v-if="row.status == 4">审批已上报</span>
          <span v-if="row.status == 5">审批通过,措施待创建</span>
          <span v-if="row.status == 6">措施下发</span>
          <span v-if="row.status == 7">反馈待验证</span>
          <span v-if="row.status == 8">措施验证已上报</span>
          <span v-if="row.status == 9">验证不通过-重新反馈</span>
          <span v-if="row.status == 10">验证通过-流程结束</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人">
        <template slot-scope="{ row }">
          <div v-if="row.reviewerInfo == null||row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <transactor :data="row.reviewerInfo" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录">
        <template slot-scope="{ row }">
          <div v-if="row.noteComment == null||row.noteComment.length==0">-</div>
          <el-popover v-else placement="left" width="600">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.noteComment" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核" width="100" v-if="!hiddenField.includes('审核')">
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
          >下发</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <hairdown
      ref="noteHairdown"
      :data="data"
      :form="formHairdown"
      :multiple="false"
      :issue="false"
    />
    <handleNotes ref="handleNotes" :isSecChild="true" :source="source" />
    <cmdIssue ref="cmdIssueNotes" />
  </div>
</template>
<script>
import leaderApprvalRecord from './leaderApprvalRecord'
import handleNotes from './handleTo4'
import hairdown from './hairdown'
import { specialRiskFill, queryIssueTreeNoteData, queryIsLM, specialNoticeRiskSubNotes } from '@/api/risk'
import cmdIssue from './cmdIssueTreeTable'
import { format, formatShortDate } from '@/utils/datetime'
import transactor from '@/components/common/transactor'
export default {
  components: {
    leaderApprvalRecord,
    handleNotes,
    cmdIssue,
    hairdown,
    transactor,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
    source: {
      type: String,
      default: '',
    },
    showIssueRecord: {
      type: Boolean,
      default: true,
    },
    hiddenField: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      reviewLoading: false,
      tbLoading: false,
      formHairdown: {},
    }
  },
  methods: {
    format,
    formatShortDate,
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url
    },
    doHandle(row) {
      this.reviewLoading = true
      specialRiskFill(row.taskId).then((res) => {
        this.reviewLoading = false
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          let _this = this.$refs.handleNotes
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
      queryIsLM(this.data.id).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$refs.noteHairdown.deptBool = res.obj
          this.formHairdown.formId = row.id
          this.formHairdown.taskId = row.parentTaskId
          this.formHairdown.pathAndDeadLines = []
          this.$refs.noteHairdown.dialog = true
        }
      })
    },
    issueRecord(row) {
      this.tbLoading = true
      const issueType = '1'
      queryIssueTreeNoteData(issueType, row.parentId).then((res) => {
        this.tbLoading = false
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          let _this = this.$refs.cmdIssueNotes
          _this.data = res.obj
          _this.dialog = true
        }
      })
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      specialNoticeRiskSubNotes(tree.formId).then(res => {
        resolve(res.obj)
      })
    }
  },
}
</script>