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
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column prop="no" label="编号" width="120" />
      <el-table-column label="发生日期" width="100">
        <template slot-scope="{row}">{{formatShortDate(row.happenDate)}}</template>
      </el-table-column>
      <el-table-column prop="eventOverview" label="问题描述" min-width="110" show-overflow-tooltip />
      <el-table-column prop="deptNameCn1" label="责任单位层级一" width="130" />
      <el-table-column prop="deptNameCn2" label="责任单位层级二" width="130" />
      <el-table-column prop="deptNameCn3" label="责任单位层级三" width="130" />
      <el-table-column prop="productText" label="产品" width="110" />
      <el-table-column prop="systemText" label="系统" width="110" />
      <el-table-column prop="riskLevelText1" label="危险源层级一" width="110" />
      <el-table-column prop="riskLevelText2" label="危险源层级二" width="110" />
      <el-table-column prop="sourceOfRiskText" label="危险源" width="150" show-overflow-tooltip />
      <el-table-column prop="riskText" label="风险" width="150" show-overflow-tooltip/>
      <el-table-column prop="incentiveText" label="诱因" width="150" show-overflow-tooltip/>
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
import { formatShortDate } from "@/utils/datetime";
export default {
  mixins: [initData],
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.init();
      },
    },
  },
  created() {
    this.loading = false;
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/dangerManagerment/riskAssessment/query/pageList/${this.page}/${this.size}`;
      this.params =this.form;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>