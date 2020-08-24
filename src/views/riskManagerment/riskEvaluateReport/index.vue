<template>
  <div class="app-container">
    <div class="head-container">
      <h3>数据筛选</h3>
      <search @createCharts="createCharts" @toQuery="toQuery" />
    </div>
    <h3 class="mt-01">数据分析</h3>
    <el-tabs>
      <el-tab-pane label="报表">
        <reporttb :form="queryForm" />
      </el-tab-pane>
      <el-tab-pane label="图表" lazy>
        <charttb />
      </el-tab-pane>
      <el-tab-pane label="月度风险评价报告" lazy>
        <monthreport />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { infoDatabase } from "@/dataSource";
import search from "./search";
import reporttb from "./components/reportTb";
import charttb from "./components/chartTb";
import monthreport from "./components/monthReport";
export default {
  components: { search, reporttb, charttb, monthreport },
  data() {
    return {
      queryForm: {},
    };
  },
  mounted() {},

  methods: {
    toQuery(form) {
      // 防止重复按搜索键没有响应
      let _f = Object.assign({}, form);
      this.queryForm = _f;
    },
    createCharts(command) {
      this.$message(command);
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
.head-container {
  // margin-bottom: 20px;
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
.mt-0 {
  margin-top: 0;
}
</style>