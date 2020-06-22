<template>
  <div class="app-container">
    <div class="head-container">
      <el-button type="success" icon="el-icon-s-data" size="mini" @click="tongji">统计</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="任务名称" />
      <el-table-column prop="bb" label="编号" />
      <el-table-column prop="cc" label="时间" />
      <el-table-column prop="dd" label="年度" />
      <el-table-column prop="ee" label="反馈日期" />
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
    <!-- 统计 -->
    <charts ref="charts"></charts>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import charts from "./charts";
export default {
  components: { charts },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
  mounted() {
    this.loading = false;
    this.data=[
      {aa:"方案制定存在缺陷",bb:"YP2020050501",cc:"2020-05-06",dd:"2020",ee:"2020-05-06"}
    ]
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    tongji() {
      let _this = this.$refs.charts;
      _this.dialog = true;
    },
    edit() {},
    subDelete() {}
  }
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  margin-bottom: 20px;
}
</style>