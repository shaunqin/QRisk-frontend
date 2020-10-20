<template>
  <div class="app-container">
    <div class="head-container">
      <h3>数据筛选</h3>
      <search ref="search" @create-charts="createCharts" @toQuery="toQuery" />
    </div>
    <h3 class="mt-01">数据分析</h3>
    <el-tabs :value="tabIndex" @tab-click="change">
      <el-tab-pane label="报表" name="1">
        <reporttb :form="queryForm1" />
      </el-tab-pane>
      <el-tab-pane label="图表" name="2">
        <charttb :form="queryForm2" />
      </el-tab-pane>
      <el-tab-pane label="月度风险评价报告" lazy name="3">
        <monthreport :form="queryForm1" />
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
import { eventBus } from "@/utils/eventBus";
import { mapMutations } from "vuex";
export default {
  components: { search, reporttb, charttb, monthreport },
  data() {
    return {
      tabIndex: "1",
      queryForm1: {},
      queryForm2: {},
    };
  },
  mounted() {
    eventBus.$on("tab-change", (name) => {
      this.tabIndex = name;
    });
  },

  methods: {
    ...mapMutations({
      SET_RESETCHART: 'user/SET_RESETCHART'
    }),
    toQuery(form) {
      // 防止重复按搜索键没有响应
      let _f = Object.assign({}, form);
      this.queryForm1 = _f;
    },
    createCharts(form) {
      let _f = Object.assign({}, form);
      this.queryForm2 = _f;
    },
    change(tab) {
      this.tabIndex = tab.name;
      this.SET_RESETCHART(tab.name);
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