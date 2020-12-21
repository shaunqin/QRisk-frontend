<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <div class="app-container">
      <!-- <div class="head-container">
      <el-form :model="form" size="mini" inline>
        <el-form-item label="编号">
          <el-input v-model="form.no" placeholder></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder></el-input>
        </el-form-item>
        <el-form-item label="月度">
          <el-date-picker v-model="form.date" type="month" value-format="yyyy-MM" placeholder></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      </div>-->
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" stripe>
        <el-table-column prop="no" label="编号" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="年月">
          <template slot-scope="{row}">{{`${row.year}-${row.month}`}}</template>
        </el-table-column>
        <el-table-column label="拟制人">
          <template slot-scope="{row}">{{`${row.issueName}[${row.issuer}]`}}</template>
        </el-table-column>
        <el-table-column label="待办部门" prop="todoDeptPathName" />
        <el-table-column label="待办状态">
          <template slot-scope="{row}">
            <span v-if="row.todoStatus==0">待处理</span>
            <span v-if="row.todoStatus==1">已下发</span>
            <span v-if="row.todoStatus==2">已上报</span>
            <span v-if="row.todoStatus==3">同意</span>
            <span v-if="row.todoStatus==4">驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="{row}">{{formatShortDate(row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140px" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
              <el-button size="mini" type="warning" @click="sendNotice(scope.row)">通知</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page"
        style="margin-top: 8px;text-align: right"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
      <detail ref="detail"></detail>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initData from "@/mixins/initData";
import detail from "../../evaluateReportMonthly/components/detail"; // 取月度评价报告的详情
import { formatShortDate } from '@/utils/datetime'
import { riskControlDetailByFormId, riskControlSendDealNotice } from '@/api/risk'
export default {
  components: { detail },
  mixins: [initData],
  data() {
    return {
      dialog: false,
      dialogType: "",
      form: { no: "", title: "", date: "" },
      riskControlId: "",
    };
  },
  watch: {
    riskControlId(val) {
      if (val) {
        this.params = { riskControlId: val };
        this.init();
      }
    }
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/pageTodoList/${this.page}/${this.size}`;
      this.params = { ...this.params };
      return true;
    },
    toQuery() {
      this.params = { ...this.params, ...this.form };
      this.page = 1;
      this.init();
    },
    reset() {
      this.form = { no: "", title: "", date: "" };
      this.toQuery();
    },
    detail(row) {
      riskControlDetailByFormId(row.todoId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
    sendNotice(row) {
      this.$confirm("确认发送通知吗?").then(() => {
        this.loading = true;
        riskControlSendDealNotice(row.todoId).then(res => {
          this.loading = false;
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.$message.success("通知发送成功");
          }
        })
      }).catch(() => { });
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.riskControlId = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
// .head-container {
//   margin-bottom: 20px;
// }
</style>