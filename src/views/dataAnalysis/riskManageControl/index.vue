<template>
  <div class="app-container">
    <div class="head-container">
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
    </div>
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
      <el-table-column label="创建时间">
        <template slot-scope="{row}">{{formatShortDate(row.createTime)}}</template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
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
    <list ref="list" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import list from "./components/list";
import { formatShortDate } from '@/utils/datetime'
import { riskControlDetailByFormId, riskControlSendDealNotice } from '@/api/risk'
export default {
  components: { list },
  mixins: [initData],
  data() {
    return {
      dialogType: "",
      form: { no: "", title: "", date: "" },
    };
  },
  created() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/mainTodo/${this.page}/${this.size}`;
      this.params = { ...this.params };
      return true;
    },
    toQuery() {
      this.params = this.form;
      this.page = 1;
      this.init();
    },
    reset() {
      this.form = { no: "", title: "", date: "" };
      this.toQuery();
    },
    detail(row) {
      let _this = this.$refs.list;
      _this.riskControlId = row.id;
      _this.dialog = true
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
    }
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