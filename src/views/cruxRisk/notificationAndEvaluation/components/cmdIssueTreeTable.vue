<template>
  <div>
    <el-table
      :data="data.trees"
      size="mini"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      lazy
      :load="loadTree"
    >
      <el-table-column label="下发部门" prop="deptName" width="140" align="left" />
      <el-table-column label="截止日期">
        <template slot-scope="{ row }">{{ row.data.deadline }}</template>
      </el-table-column>
      <el-table-column label="通知内容" min-width="100">
        <template slot-scope="{ row }">{{ row.data.content }}</template>
      </el-table-column>
      <el-table-column label="下发人" prop="issuer" />
      <el-table-column label="填报人" prop="filler" />
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
          <div v-if="row.reviewerInfo == null || row.reviewerInfo.length == 0">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <transactor :data="row.reviewerInfo" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录">
        <template slot-scope="{ row }">
          <div v-if="row.comments == null || row.comments.length == 0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.comments" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
import { keyRiskSubNotes, } from "@/api/risk";
import { format, formatShortDate } from "@/utils/datetime";
import transactor from "@/components/common/transactor";
export default {
  components: {
    leaderApprvalRecord,
    transactor,
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    source: {
      type: String,
      default: "",
    },
    showIssueRecord: {
      type: Boolean,
      default: true,
    },
    hiddenField: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      reviewLoading: false,
      tbLoading: false,
      formHairdown: {},
    };
  },
  methods: {
    format,
    formatShortDate,
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      keyRiskSubNotes(tree.formId).then((res) => {
        resolve(res.obj);
      });
    },
  },
};
</script>
