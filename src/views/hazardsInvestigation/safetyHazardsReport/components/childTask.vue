<template>
  <div>
    <el-table v-loading="loading" :data="data" size="mini">
      <el-table-column prop="deptName" label="部门" />
      <el-table-column label="填报日期">
        <template slot-scope="{row}">
          <span>{{formatShortDate(row.fillDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="填报人">
        <template slot-scope="{row}">
          <span v-if="row.filler!=null">{{row.fillerName}}[{{row.filler}}]</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span v-if="row.status==2">待办</span>
          <span v-if="row.status==3">待办</span>
          <span v-if="row.status==4">已填报</span>
          <span v-if="row.status==5">通过</span>
          <span v-if="row.status==6">驳回</span>
          <span v-if="row.status==7">取消</span>
        </template>
      </el-table-column>
      <el-table-column label="管控清单" width="100">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="showList(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="办理人">
        <template slot-scope="{row}">
          <div v-if="row.reviewerInfo==null">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" slot="reference">详情</el-button>
            <transactor :data="row.reviewerInfo" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录" width="80">
        <template slot-scope="{row}">
          <div v-if="row.comments==null">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" slot="reference">详情</el-button>
            <approvalRecord :data="row.comments" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="!hiddenField.includes('审核')" label="审核" width="80">
        <template slot-scope="{row}">
          <span v-if="!row.reviewing">-</span>
          <el-button v-else type="primary" size="mini" @click="doHandle(row)">办理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下发记录" width="100">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="issueRecord(row)">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <list2copy ref="list2copy" :readonly="readonly" />
    <handle ref="handle" :source="source" />
    <cmdIssue ref="cmdIssue" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import approvalRecord from './approvalRecord'
import { queryControlListDetail, queryHazards, queryIssueTreeData } from '@/api/hazards'
import list2copy from './list2copy'
import handle from './handlTo2'
import cmdIssue from './cmdIssueTreeTable'
import transactor from '@/components/common/transactor'
export default {
  components: { approvalRecord, list2copy, handle, cmdIssue, transactor },
  data() {
    return {
      loading: false
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    hiddenField: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: ''
    },
  },
  methods: {
    formatShortDate,
    showList(row) {
      queryControlListDetail(row.taskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.list2copy;
          _this.tbSource = res.obj.hiddenDangerControlList;
          _this.dialog = true;
        }
      })
    },
    doHandle(row) {
      queryHazards(row.runTaskId, row.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.runTaskId;
          _this.form.formId = row.formId;
          _this.parentTaskId = row.parentTaskId;
          _this.noHiddenDanger = res.obj.noHiddenDanger;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          _this.dialog = true;
        }
      });
    },
    issueRecord(row) {
      this.loading = true;
      queryIssueTreeData(row.taskId).then(res => {
        this.loading = false;
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
}
</script>

<style lang="scss" scoped>
</style>