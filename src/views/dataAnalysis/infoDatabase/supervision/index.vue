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
      <el-table-column prop="id" label="编号" />
      <el-table-column label="发生日期" width="120">
        <template slot-scope="{row}">{{row.dateTime.substring(0,10)}}</template>
      </el-table-column>
      <el-table-column prop="problemDescription" label="问题描述" width="200" show-overflow-tooltip />
      <el-table-column prop="cc" label="责任单位层级一" width="120" />
      <el-table-column prop="dd" label="责任单位层级二" width="120" />
      <el-table-column prop="departmentNameCn" label="责任部门" width="120" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品" width="120" />
      <el-table-column prop="systemName" label="系统" />
      <el-table-column prop="riskLevelName1" label="危险源层级一" width="110" />
      <el-table-column prop="riskLevelName2" label="危险源层级二" width="110" />
      <el-table-column prop="sourceOfRiskName" label="危险源" width="200" />
      <el-table-column prop="risk" label="风险" width="150" show-overflow-tooltip />
      <el-table-column prop="incentive" label="诱因" width="150" show-overflow-tooltip />
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
    toQuery(name) {},
    beforeInit() {
      this.url = `/info_mgr/supervise_mgr/query/pageList/${this.page}/${this.size}`;
      this.params.dataType = "6";
      return true;
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