<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd"></eform>
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
      <el-button class="filter-item" size="mini" type="success">导出</el-button>
      <el-button class="filter-item" size="mini" type="success" @click="report">上报</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="jj" label="编号" />
      <el-table-column prop="aa" label="名称" />
      <el-table-column prop="bb" label="发现时间" />
     <el-table-column prop="cc" label="创建时间" />
      <el-table-column prop="dd" label="修改时间" />
      <el-table-column prop="ee" label="创建人" />
      <!-- <el-table-column prop="ff" label="整改进展" /> -->
      <el-table-column prop="gg" label="上报单位" />
      <el-table-column prop="hh" label="上报日期" />
      <el-table-column prop="ii" label="明细" />
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
    <!-- 上报 -->
    <report ref="report"></report>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import { safetyHazardsFollow } from "@/dataSource";
import report from "./components/report";
export default {
  components: { eform, report },
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
    this.data = safetyHazardsFollow;
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    report() {
      let _this = this.$refs.report;
      _this.form = {
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06"
      };
      _this.dialog = true;
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