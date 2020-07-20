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
      <el-table-column label="公司风险严重性等级">
        <el-table-column prop="riskLevel" label="严重性等级" width="100">
          <template slot-scope="{row}">{{row.riskLevel}}级</template>
        </el-table-column>
        <el-table-column prop="standard" label="界定标准" />
        <el-table-column prop="score" label="量化分值" width="100" />
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <!-- <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />-->
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  props: {
    deptPath: {
      type: String,
      default: ""
    }
  },
  created() {
    this.init();
  },
  watch: {
    deptPath(val) {
      this.init();
    }
  },
  methods: {
    beforeInit() {
      this.url = `/info_mgr/riskLevel_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { deptPath: this.deptPath || "000003", type: 2 };
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>