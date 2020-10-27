<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        size="mini"
        v-model="query"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px"
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
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-plus"
        @click="add"
      >新建任务</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="日期" />
      <el-table-column prop="bb" label="任务类型" />
      <el-table-column prop="cc" label="任务通知" />
      <el-table-column prop="dd" label="反馈时间" />
      <el-table-column prop="ee" label="安全隐患管控清单">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showHazardsList(row)">{{ row.ee }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ff" label="安全隐患统计表">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showHazardsStatistics(row)">{{ row.ff }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="255px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="report">上报</el-button>
            <el-button size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" @click="subDelete(scope.row.id)"></el-button>
            <el-button size="mini">取消任务</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px; text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <!-- 上报 -->
    <report ref="report"></report>
    <!-- 任务 -->
    <task ref="task" :is-add="isAdd" />
    <!-- 安全隐患管控清单 -->
    <hazardsList ref="hazardsList" />
    <!-- 安全隐患统计表 -->
    <hazardsStatistics ref="hazardsStatistics" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { safetyHazardsFollow } from "@/dataSource";
import report from "./components/report";
import task from "./components/task";
import hazardsList from "./components/hazardsList/list";
import hazardsStatistics from './components/hazardsStatistics/form'
export default {
  components: { report, task, hazardsList, hazardsStatistics },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
    };
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "2020-04-05",
        bb: "年度任务",
        cc: "方案制定存在缺陷",
        dd: "2020-06-16",
        ee: "方案制定存在缺陷",
        ff: "方案制定存在缺陷",
      });
    }
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
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.task.dialog = true;
    },
    addSingle() {
      this.$refs.singleTask.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.task;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    report() {
      let _this = this.$refs.report;
      _this.dialog = true;
    },
    showHazardsList(row) {
      let _this = this.$refs.hazardsList;
      _this.dialog = true;
    },
    showHazardsStatistics(row) {
      let _this = this.$refs.hazardsStatistics;
      _this.dialog = true;
    }
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