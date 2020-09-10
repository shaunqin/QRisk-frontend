<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column prop="name" label="任务名称" min-width="110" show-overflow-tooltip />
      <el-table-column prop="businessName" label="流程名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
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
import { format } from "@/utils/datetime";
export default {
  mixins: [initData],
  mounted() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/hasDone/${this.page}/${this.size}`;
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>