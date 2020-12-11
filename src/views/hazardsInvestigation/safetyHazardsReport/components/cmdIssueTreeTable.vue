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
      <el-table-column prop="deptName" label="部门" align="left" />
      <el-table-column label="填报日期">
        <template slot-scope="{row}">
          <span>{{formatShortDate(row.fillDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下发人" prop="issuer" width="130" />
      <el-table-column label="上报人" prop="filler" width="130" />
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
          <span v-if="row.status==2||row.status==3">-</span>
          <el-button v-else type="info" size="mini" @click="showList(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="办理人" width="80">
        <template slot-scope="{row}">
          <div v-if="row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" slot="reference">详情</el-button>
            <el-table :data="row.reviewerInfo" size="mini">
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
      <el-table-column label="审批记录" width="80">
        <template slot-scope="{row}">
          <div v-if="row.comments.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" slot="reference">详情</el-button>
            <approvalRecord :data="row.comments" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
    <list2copy ref="list2copy" :readonly="true" />
  </el-dialog>
</template>

<script>
import approvalRecord from "./approvalRecord";
import { formatShortDate } from '@/utils/datetime'
import { queryControlListDetail, } from '@/api/hazards'
import list2copy from './list2copy'
export default {
  components: { approvalRecord, list2copy },
  data() {
    return {
      dialog: false,
      data: []
    }
  },
  methods: {
    formatShortDate,
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
    showList(row) {
      queryControlListDetail(row.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.list2copy;
          _this.tbSource = res.obj.hiddenDangerControlList;
          _this.dialog = true;
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>