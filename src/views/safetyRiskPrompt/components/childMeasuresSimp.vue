<template>
  <div>
    <el-table
      v-loading="tbLoading"
      :data="data"
      size="mini"
      row-key="deptPath"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      lazy
      :load="loadTree"
    >
      <el-table-column label="下发部门" prop="deptName" align="left" />
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span v-if="row.status==1">未完成</span>
          <span v-if="row.status==2">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showMore(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="cancel"
      :visible.sync="dialog"
      custom-class="big_dialog"
      title="措施详情"
    >
      <el-table :data="measuresList" size="mini">
        <el-table-column label="截止日期" width="100" prop="deadline" />
        <el-table-column label="措施内容" min-width="150" prop="content" />
        <el-table-column label="落实情况" min-width="200" align="left">
          <template slot-scope="{row}">
            <span style="white-space: pre-wrap;">{{row.implementStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下发人" width="120">
          <template slot-scope="{row}">{{`${row.issuerName}[${row.issuer}]`}}</template>
        </el-table-column>
        <el-table-column label="上报人" width="120">
          <template slot-scope="{row}">{{`${row.fillerName}[${row.filler}]`}}</template>
        </el-table-column>
        <el-table-column label="附件预览" min-width="120">
          <template slot-scope="{row}">
            <div v-for="(item, index) in row.accessory" :key="index">
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
            <span v-if="row.status==0">待上报</span>
            <span v-if="row.status==1">已下发</span>
            <span v-if="row.status==2">待审核</span>
            <span v-if="row.status==3">通过</span>
            <span v-if="row.status==4">驳回</span>
            <span v-if="row.status == 5">已取消</span>
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
            <div v-if="row.measureComment==null||row.measureComment.length==0">-</div>
            <el-popover v-else placement="left" width="1000">
              <el-button type="text" size="mini" slot="reference">详情</el-button>
              <leaderApprvalRecord :data="row.measureComment" type="safety_measures" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
import transactor from '@/components/common/transactor'
import { riskNoticeQueryChildren, riskNoticeQueryMeasures } from "@/api/risk";
export default {
  components: { leaderApprvalRecord, transactor },
  data() {
    return {
      tbLoading: false,
      dialog: false,
      measuresList: []
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: ""
    }
  },
  methods: {
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      riskNoticeQueryChildren(tree.deptPath, this.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
          resolve([]);
        } else {
          resolve(res.obj)
        }
      })
    },
    showMore(row) {
      this.tbLoading = true;
      riskNoticeQueryMeasures(row.deptPath, this.id).then(res => {
        this.tbLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.measuresList = res.obj;
          this.dialog = true;
        }
      })
    },
    cancel() {
      this.dialog = false;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>