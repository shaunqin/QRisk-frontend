<template>
  <div>
    <el-table :data="data" size="mini">
      <el-table-column label="截止日期" prop="deadline" width="100" />
      <el-table-column label="下发部门" prop="deptName" width="110" show-overflow-tooltip />
      <el-table-column label="措施内容" prop="content" />
      <el-table-column label="落实情况" prop="implementStatus" />
      <el-table-column label="上报人" width="120">
        <template slot-scope="{row}" v-if="row.filler!=null">{{`${row.fillerName}[${row.filler}]`}}</template>
      </el-table-column>
      <el-table-column label="附件预览" width="120">
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
      <el-table-column label="状态" width="100">
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
          <div v-if="row.reviewerInfo==null">-</div>
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
          <div v-if="row.measureComment==null">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.measureComment" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核" width="80">
        <template slot-scope="{row}">
          <span v-if="!row.reviewing">-</span>
          <el-button v-else type="primary" size="mini" @click="doHandle(row)">办理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ehandle ref="ehandle" :isSecChild="true" :source="source" />
  </div>
</template>

<script>
import leaderApprvalRecord from "./leaderApprvalRecord";
import ehandle from "./handleTo4";
import { riskNoticeQueryTask } from "@/api/risk";
export default {
  components: { leaderApprvalRecord, ehandle },
  props: {
    data: {
      type: Array,
      default: [],
    },
    source: {
      type: String,
      default: ''
    }
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
</style>