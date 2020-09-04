<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        size="mini"
        v-model="query"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(query)"
      >搜索</el-button>
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
          <span>{{row.happenDate.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eventOverview" label="事件概述" min-width="150" show-overflow-tooltip/>
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { infoDatabase } from "@/dataSource";
export default {
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
    beforeInit() {
      this.url = `/infoDatabase_mgr/infoDatabase_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { type: 8 };
      return true;
    },
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
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
  margin-bottom: 20px;
}
</style>