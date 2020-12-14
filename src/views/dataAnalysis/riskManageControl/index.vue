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
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe
      @selection-change="selectionChange"
    >
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
            <el-button size="mini" type="warning">通知</el-button>
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
    <detail ref="detail" :type="dialogType"></detail>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import detail from "./components/detail";
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { eform, detail },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
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
      this.url = `/riskControlManage/riskControlManage/query/pageTodoList/${this.page}/${this.size}`;
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
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    riskControl() {
      this.dialogType = "";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    detail(row) {
      let _this = this.$refs.detail;
      _this.form = {
        aa:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        bb: "FP2020050501",
        cc: "批准",
        dd: "上海",
        ee: "2020-06-06",
        ff: "上海",
        gg: "杭州",
        hh: `2020 年 6 月 5 日，A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息，飞机返航，该机 5月 3 日曾出现相同的故障信息，并造成飞机返航`,
        jj: "FP2020050501",
      };
      _this.riskForm = {
        aa: "出现大翼引气渗漏等",
        bb:
          "A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息",
        cc: "出现相同的故障信息，并造成飞机返航",
        dd: "高",
        ee: "高",
        ff: "3",
      };
      _this.dialog = true;
    },
    approval(row) {
      this.dialogType = "审批";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    feedback(row) {
      this.dialogType = "反馈";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
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