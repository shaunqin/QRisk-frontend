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
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
      <el-table-column label="下发人" prop="issuer" width="130" />
      <el-table-column label="上报人" prop="filler" width="130" />
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
          <div v-if="row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <el-table :data="row.reviewerInfo">
              <el-table-column label="任务名称" prop="taskName"></el-table-column>
              <el-table-column label="分配人" width="135">
                <template slot-scope="{row}">{{row.name||"-"}}</template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="{row}">{{row.groupName||"-"}}</template>
              </el-table-column>
              <el-table-column label="候选人">
                <template slot-scope="{row}">{{row.users||"-"}}</template>
              </el-table-column>
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录" width="100">
        <template slot-scope="{row}">
          <div v-if="row.comments.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.comments" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
export default {
  components: { leaderApprvalRecord },
  data() {
    return {
      dialog: false,
      data: []
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
  },
}
</script>

<style lang="scss" scoped>
</style>