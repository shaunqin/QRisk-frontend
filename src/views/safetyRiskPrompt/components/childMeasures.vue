<template>
  <div>
    <el-table
      ref="table"
      v-loading="tbLoading"
      :data="data"
      size="mini"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column type label="措施内容" min-width="150">
        <template slot-scope="{row}">{{row.data.content}}</template>
      </el-table-column>
      <!-- <el-table-column type="expand">
        <template slot-scope="{row}"></template>
      </el-table-column>-->
      <el-table-column label="下发部门" prop="deptName" width="140" align="left">
        <template slot-scope="{row}">
          <el-button v-if="row.hasChildren" type="text" @click="getIssueTree(row)">{{row.deptName}}</el-button>
          <span v-else>{{row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" width="100">
        <template slot-scope="{row}">{{row.data.deadline}}</template>
      </el-table-column>
      <el-table-column label="落实情况" min-width="200" align="left">
        <template slot-scope="{row}">
          <span style="white-space: pre-wrap;">{{row.data.impl}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="下发人" width="120" prop="issuer" />
      <el-table-column label="上报人" width="120" prop="filler" />-->
      <el-table-column label="附件预览" min-width="120">
        <template slot-scope="{row}">
          <div v-for="(item, index) in row.data.files" :key="index">
            <el-link
              type="primary"
              v-if="item!=null"
              :href="getUrl(item.filePath)"
              target="_blank"
            >{{item.originFileName}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" v-if="!hiddenField.includes('状态')">
        <template slot-scope="{row}">
          <span v-if="row.status==0">未完成</span>
          <span v-if="row.status==1">未完成</span>
          <span v-if="row.status==2">未完成</span>
          <span v-if="row.status==3">已完成</span>
          <span v-if="row.status==4">未完成</span>
          <span v-if="row.status == 5">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="办理/审批记录" width="130">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showRecord(row)">详情</el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column label="办理人" width="80">
        <template slot-scope="{row}">
          <div v-if="row.reviewerInfo==null||row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <transactor :data="row.reviewerInfo" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录" width="100">
        <template slot-scope="{row}">
          <div v-if="row.comments==null||row.comments.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.comments" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>-->
      <el-table-column label="审核" width="80" v-if="!hiddenField.includes('审核')">
        <template slot-scope="{row}">
          <span v-if="!row.reviewing">-</span>
          <el-button v-else type="primary" size="mini" @click="doHandle(row)">办理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" v-if="!hiddenField.includes('操作')">
        <template slot-scope="{row}">
          <span v-if="!row.rollback">-</span>
          <el-button v-else type="primary" size="mini" @click="doRollback(row)">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ehandle ref="ehandle" :isSecChild="true" :source="source" />
    <cmdIssue ref="cmdIssue" />
    <handleApproval ref="handleApproval" :statusAndreviewerInfo="statusAndreviewerInfo" />
  </div>
</template>

<script>
// import leaderApprvalRecord from "./leaderApprvalRecord";
import ehandle from "./handleTo4";
import {
  riskNoticeQueryTask, queryIssueTreeData, riskNoticeLazyLoadIssueTree,
  riskNoticeApproveHistory, riskNoticeRollback
} from "@/api/risk";
import cmdIssue from './cmdIssueTreeTable'
import { format } from '@/utils/datetime'
// import transactor from '@/components/common/transactor'
import handleApproval from './cptHandleApproval'
export default {
  components: {
    // leaderApprvalRecord, transactor,
    ehandle, cmdIssue, handleApproval
  },
  data() {
    return {
      tbLoading: false,
      spanArr: [],
      position: 0,
      statusAndreviewerInfo: []
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    source: {
      type: String,
      default: ''
    },
    hiddenField: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: ""
    },
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.getSpan()
      }
    }
  },
  mounted() {
    this.getSpan();
  },
  methods: {
    format,
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    doHandle(row) {
      this.loading = true;
      riskNoticeQueryTask(row.taskId, row.formId).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.ehandle;
          _this.data = { ...res.obj, measures: res.obj.measuresVos };
          _this.form.taskId = row.taskId;
          _this.form.formId = row.formId;
          _this.parentTaskId = row.parentTaskId;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? res.obj.deptMeasure.implementStatus || "" : "";
          } else {
            _this.form.comment = "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? res.obj.deptMeasure.implementStatus || "" : "";
          _this.dialog = true;
        }
      });
    },
    getIssueTree(row) {
      let _this = this.$refs.cmdIssue;
      this.tbLoading = true;
      riskNoticeLazyLoadIssueTree(row.id).then(res => {
        this.tbLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getSpan() {
      let data = this.data;
      this.spanArr = [];
      this.position = 0;
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (data[index].data.content === data[index - 1].data.content) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    showRecord(row) {
      // 状态和下一办理人
      let statusAndreviewerInfo = [];
      if (row.reviewerInfo != null && row.reviewerInfo.length > 0) {
        row.reviewerInfo.map(item => {
          statusAndreviewerInfo.push({
            status: row.status,
            ...item
          })
        })
      } else {
        statusAndreviewerInfo.push({
          status: row.status,
        })
      }
      this.statusAndreviewerInfo = statusAndreviewerInfo;

      let _this = this.$refs.handleApproval;
      _this.dialog = true;
      _this.tbLoading = true;
      riskNoticeApproveHistory(row.id).then(res => {
        _this.tbLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
        }
      })
    },
    doRollback(row) {
      if (this.id) {
        this.$confirm("确认撤回吗?").then(() => {
          this.tbLoading = true;
          riskNoticeRollback(row.id).then(res => {
            this.tbLoading = false;
            if (res.code != '200') {
              this.$message.error(res.msg);
            } else {
              this.$message.success("撤回成功")
              this.$parent.$parent.$parent.$parent.$parent.detail({ id: this.id });
            }
          })
        }).catch(() => { })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>