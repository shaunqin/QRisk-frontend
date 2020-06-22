<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="风险" width="100" />
      <el-table-column prop="bb" label="通知内容" />
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">下发</el-button>
          <el-button type="primary" size="mini" @click="fillin(scope.row)">填报</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">审批</el-button>
          <el-button type="primary" size="mini" @click="feedback(scope.row)">反馈</el-button>
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
    <!-- 填报 -->
    <fillin-dialog ref="fillinDialog"></fillin-dialog>
    <!-- 反馈 -->
    <feedback-dialog ref="feedbackDialog"></feedback-dialog>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import fillinDialog from "./components/fillinDialog";
import feedbackDialog from "./components/feedbackDialog";
import eform from "./form";
export default {
  components: { eform, fillinDialog, feedbackDialog },
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
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "安全风险",
        bb:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。"
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
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      console.log(row);
    },
    fillin(row) {
      let _this = this.$refs.fillinDialog;
      _this.dialog = true;
    },
    feedback(row){
      let _this = this.$refs.feedbackDialog;
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