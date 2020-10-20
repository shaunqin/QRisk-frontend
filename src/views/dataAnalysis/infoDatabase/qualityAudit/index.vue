<template>
  <div class="app-container">
    <div class="head-container">
      <search />
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
      <el-table-column prop="no" :label="$t('analysis.no')" width="120" />
      <el-table-column :label="$t('analysis.happenDate')" width="120">
        <template slot-scope="{row}">{{formatShortDate(row.dateTime)}}</template>
      </el-table-column>
      <el-table-column
        prop="problemDescription"
        :label="$t('analysis.problemDesc')"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="cc" :label="$t('analysis.unitLevel1')" width="120" />
      <el-table-column prop="dd" :label="$t('analysis.unitLevel2')" width="120" />
      <el-table-column
        prop="departmentNameCn"
        :label="$t('analysis.department')"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="productName" :label="$t('analysis.product')" width="120" />
      <el-table-column prop="systemName" :label="$t('analysis.system')" />
      <el-table-column prop="riskLevelName1" :label="$t('analysis.riskLevel1')" width="110" />
      <el-table-column prop="riskLevelName2" :label="$t('analysis.riskLevel2')" width="110" />
      <el-table-column prop="sourceOfRiskName" :label="$t('analysis.sourceOfRisk')" width="200" />
      <el-table-column prop="risk" :label="$t('analysis.risk')" width="150" show-overflow-tooltip />
      <el-table-column
        prop="incentive"
        :label="$t('analysis.incentive')"
        width="150"
        show-overflow-tooltip
      />
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
import search from "../components/search";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { search },
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
      this.url = `/info_mgr/supervise_mgr/query/pageList/${this.page}/${this.size}`;
      this.params.dataType = "7";
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
</style>