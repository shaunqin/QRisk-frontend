<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
  >
    <el-table
      :data="data"
      size="mini"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      lazy
      :load="loadTree"
    >
      <el-table-column label="部门" prop="deptName" width="200" align="left" show-overflow-tooltip />
      <el-table-column label="截止日期">
        <template slot-scope="{row}">{{row.data.deadline}}</template>
      </el-table-column>
      <el-table-column label="措施内容">
        <template slot-scope="{row}">{{row.data.content}}</template>
      </el-table-column>
      <el-table-column label="落实情况">
        <template slot-scope="{row}">{{row.data.impl}}</template>
      </el-table-column>
      <!-- <el-table-column label="下发人" prop="issuer" width="130" />
      <el-table-column label="上报人" prop="filler" width="130" />-->
      <el-table-column label="附件预览">
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
      <el-table-column label="办理/审批记录" width="130">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showRecord(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
    <handleApprvalRecord ref="handleApprvalRecord" :statusAndreviewerInfo="statusAndreviewerInfo" />
  </el-dialog>
</template>

<script>
import { riskNoticeLazyLoadIssueTree, riskNoticeApproveHistory } from '@/api/risk'
import handleApprvalRecord from './cptHandleApprvalRec'
export default {
  components: { handleApprvalRecord },
  data() {
    return {
      dialog: false,
      data: [],
      statusAndreviewerInfo: []
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      riskNoticeLazyLoadIssueTree(tree.id).then(res => {
        resolve(res.obj)
      })
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

      let _this = this.$refs.handleApprvalRecord;
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

    }
  },
}
</script>

<style lang="scss" scoped>
</style>