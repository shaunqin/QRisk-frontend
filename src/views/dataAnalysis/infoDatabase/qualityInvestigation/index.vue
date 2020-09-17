<template>
  <div class="app-container">
    <div class="head-container">
      <search />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" :index="getIndex" />
      <el-table-column prop="infoSourceText" label="信息来源" width="100" />
      <el-table-column label="发生日期" width="100">
        <template slot-scope="{row}">
          <span>{{formatShortDate(row.happenDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aircraftTypeText" label="机型" />
      <el-table-column prop="eventOverview" label="事件概述" min-width="150" show-overflow-tooltip />
      <el-table-column prop="causeAnalysis" label="原因分析" min-width="150" show-overflow-tooltip />
      <el-table-column prop="departmentNameCn" label="责任单位" width="120" show-overflow-tooltip />
      <el-table-column prop="productText" label="产品" width="120" />
      <el-table-column prop="systemText" label="系统" width="110" />
      <el-table-column prop="riskLevelText1" label="危险源层级一" width="110" />
      <el-table-column prop="riskLevelText2" label="危险源层级二" width="110" />
      <el-table-column prop="sourceOfRiskText" label="危险源" width="120" show-overflow-tooltip />
      <el-table-column prop="risk" label="风险" width="120" />
      <el-table-column prop="incentive" label="诱因" width="120" />
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
    <eform ref="form" :is-add="isAdd"></eform>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import search from "../components/search2";
import eform from "./form";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { search, eform },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/infoDatabase_mgr/infoDatabase_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { type: 2, ...this.params };
      return true;
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
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
</style>