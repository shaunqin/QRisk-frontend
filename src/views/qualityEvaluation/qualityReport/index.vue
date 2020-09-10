<template>
  <div class="app-container">
    <eform ref="form" :isAdd="isAdd" />
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
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="taskNo" label="编号" />
      <el-table-column prop="taskName" label="名称" min-width="130" />
      <el-table-column prop="departmentName" label="部门" />
      <el-table-column prop="year" label="年度" />
      <el-table-column prop="month" label="月度" />
      <el-table-column label="截止日期">
        <template slot-scope="{row}">{{formatShortDate(row.dueDate)}}</template>
      </el-table-column>
      <el-table-column prop="productValue" label="产品" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" @click="subDelete(scope.row.id)"></el-button>
          </el-button-group>
        </template>
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { formatShortDate } from "@/utils/datetime";
import eform from "./form";
export default {
  components: { eform },
  mixins: [initData],
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/task_mgr/query/monthTask/pageList/${this.page}/${this.size}`;
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
.head-container {
  margin-bottom: 20px;
}
</style>