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
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="编号" />
      <el-table-column prop="bb" label="发生日期" width="100" />
      <el-table-column prop="hh" label="问题描述" />
      <el-table-column prop="cc" label="责任单位层级一" width="120" />
      <el-table-column prop="dd" label="责任单位层级二" width="120" />
      <el-table-column prop="ee" label="责任部门" />
      <el-table-column prop="ff" label="产品" width="120" />
      <el-table-column prop="gg" label="系统" />
      <el-table-column prop="ii" label="危险源层级一" width="110" />
      <el-table-column prop="jj" label="危险源层级二" width="110" />
      <el-table-column prop="kk" label="危险源" />
      <el-table-column prop="ll" label="风险" />
      <el-table-column prop="mm" label="诱因" />
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
      selections: []
    };
  },
  mounted() {
    this.loading = false;
    this.data = infoDatabase;
  },
  methods: {
    toQuery(name) {},
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    }
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