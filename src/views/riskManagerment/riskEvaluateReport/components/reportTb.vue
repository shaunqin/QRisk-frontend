<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="no" label="编号" width="110" />
      <el-table-column prop="aa" label="标题" />
      <el-table-column prop="bb" label="发生日期" width="100" />
      <el-table-column prop="nn" label="背景描述" />
      <el-table-column prop="cc" label="责任单位层级一" width="130" />
      <el-table-column prop="cc2" label="责任单位层级二" width="130" />
      <el-table-column prop="cc3" label="责任单位层级三" width="130" />
      <el-table-column prop="ff" label="产品" />
      <el-table-column prop="gg" label="系统" />
      <el-table-column prop="ii" label="危险源层级一" width="110" />
      <el-table-column prop="jj" label="危险源层级二" width="110" />
      <el-table-column prop="kk" label="危险源" width="130" />
      <el-table-column prop="ll" label="风险" width="130" />
      <el-table-column prop="mm" label="诱因" width="130" />
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
  created () {
      this.loading=false;
  },
};
</script>

<style lang="scss" scoped>
</style>