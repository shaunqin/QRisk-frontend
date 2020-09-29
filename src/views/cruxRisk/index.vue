<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="app-container">
      <div class="head-container">
        <el-button size="mini" type="success" icon="el-icon-plus" @click="add">新建通知</el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" @click="addAssessment">新建评估</el-button>
      </div>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column type="index" width="50" />
        <el-table-column prop="jj" label="编号" />
        <el-table-column prop="aa" label="风险" />
        <el-table-column prop="bb" label="标题" width="300" />
        <el-table-column prop="dd" label="发布时间" />
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
  </el-scrollbar>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  components: {},
  mixins: [initData],
  data() {
    return {
      selections: [],
      type: "",
    };
  },
  watch: {
    $route(route) {
      this.assessmentType = route.query.type;
    },
    assessmentType(val) {
      this.$notify.warning({
        message: <span style="color:red">{val}</span>,
        title: "提示",
      });
    },
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "安全风险",
        bb: "飞机在运行过程中出现大翼引气渗漏等重复性故障",
        jj: "FP202005050" + i,
        cc: "admin",
        dd: "2020-04-22",
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
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    addAssessment() {
      this.$refs.assessment.dialog = true;
    },
    edit(row) {
      console.log(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  margin-top: 10px;
  .head-container {
    margin-bottom: 10px;
  }
}
/deep/ .scrollbar-wrapper {
  height: calc(100vh - 60px);
}
</style>