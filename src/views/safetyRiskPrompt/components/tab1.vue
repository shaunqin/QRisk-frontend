<template>
  <div>
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新建</el-button>
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
      <el-table-column type="selection" width="45" />
      <el-table-column prop="no" label="编号" width="110" />
      <el-table-column label="主题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="text" @click="detail(row)">{{row.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="background" label="背景" min-width="150" show-overflow-tooltip />
      <el-table-column prop="existingRisk" label="安全风险" min-width="150" show-overflow-tooltip />
      <el-table-column prop="responseDept" label="责任单位" show-overflow-tooltip />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.issuer}}]</template>
      </el-table-column>
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
    <edetail ref="detail" :id="id" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import eform from "./form";
import edetail from "./detail";
export default {
  components: { eform, edetail },
  mixins: [initData],
  data() {
    return {
      id: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/pageList/${this.page}/${this.size}`;
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    detail(row) {
      this.id = row.id;
      this.$refs.detail.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>