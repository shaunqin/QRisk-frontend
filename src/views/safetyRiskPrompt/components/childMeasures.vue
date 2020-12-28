<template>
  <div>
    <el-table
      v-loading="tbLoading"
      :data="data"
      size="mini"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      lazy
      :load="loadTree"
    >
      <el-table-column label="下发部门" prop="deptName" width="160" align="left" />
      <el-table-column label="截止日期"  width="100">
        <template slot-scope="{row}">{{row.data.deadline}}</template>
      </el-table-column>
      <el-table-column label="措施内容" min-width="150">
        <template slot-scope="{row}">{{row.data.content}}</template>
      </el-table-column>
      <el-table-column label="落实情况" min-width="200" align="left">
        <template slot-scope="{row}">
          <span style="white-space: pre-wrap;">{{row.data.impl}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下发人" width="120" prop="issuer" />
      <el-table-column label="上报人" width="120" prop="filler" />
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
      <el-table-column label="状态" width="80">
        <template slot-scope="{row}">
          <span v-if="row.status==0">待填</span>
          <span v-if="row.status==1">待填</span>
          <span v-if="row.status==2">待审核</span>
          <span v-if="row.status==3">通过</span>
          <span v-if="row.status==4">驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人" width="80">
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
          <div v-if="row.comments==null||row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.comments" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核" width="80" v-if="!hiddenField.includes('审核')">
        <template slot-scope="{row}">
          <span v-if="!row.reviewing">-</span>
          <el-button v-else type="primary" size="mini" @click="doHandle(row)">办理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ehandle ref="ehandle" :isSecChild="true" :source="source" />
    <cmdIssue ref="cmdIssue" />
  </div>
</template>

<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
import ehandle from "./handleTo4";
import { riskNoticeQueryTask, queryIssueTreeData, riskNoticeLazyLoadIssueTree } from "@/api/risk";
import cmdIssue from './cmdIssueTreeTable'
import { format } from '@/utils/datetime'
import transactor from '@/components/common/transactor'
export default {
  components: { leaderApprvalRecord, ehandle, cmdIssue, transactor },
  data() {
    return {
      tbLoading: false
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
    }
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
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      riskNoticeLazyLoadIssueTree(tree.id).then(res => {
        resolve(res.obj)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>