<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-form :model="form" size="mini" inline>
        <el-form-item label="编号">
          <el-input v-model="form.aa" placeholder="请输入编号" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="form.bb" placeholder="请输入主题" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="责任单位">
          <el-input v-model="form.cc" placeholder="请输入责任单位" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="下发单位">
          <el-input v-model="form.ee" placeholder="请输入责任单位" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="form.dd" placeholder="请输入发布时间" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery(query)">查询</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="add"
          >新建</el-button>
          <el-button
            type="info"
            icon="el-icon-document-copy"
            @click="copy(selections[0])"
            :disabled="selections.length!=1"
          >复制</el-button>
          <el-button type="info">输出报告</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="已下发" name="1">
        <tab1 v-if="tabIndex==1" />
      </el-tab-pane>
      <el-tab-pane label="草稿" name="2">
        <tab2 v-if="tabIndex==2" />
      </el-tab-pane>
      <el-tab-pane label="我提交的" name="3">
        <tab3 v-if="tabIndex==3" />
      </el-tab-pane>
      <el-tab-pane label="待办" name="4">
        <tab4 v-if="tabIndex==4" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="5">
        <tab5 v-if="tabIndex==5" />
      </el-tab-pane>
    </el-tabs>
    <edetail ref="detail"></edetail>
  </div>
</template>

<script>
import eform from "./form";
import edetail from "./components/detail";
import tab1 from "./components/tab1";
import tab2 from "./components/tab2";
import tab3 from "./components/tab3";
import tab4 from "./components/tab4";
import tab5 from "./components/tab5";
export default {
  components: { eform, edetail, tab1, tab2, tab3, tab4, tab5 },
  data() {
    return {
      isAdd: false,
      selections: [],
      form: {
        aa: "",
      },
      tabIndex: "1",
    };
  },
  mounted() {},
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
      this.$refs.form.dialog = true;
    },
    copy(row) {
      this.isAdd = true;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    detail(row) {
      let _this = this.$refs.detail;
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
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
// .head-container {
//   margin-bottom: 20px;
// }
.title {
  color: #1890ff;
}
.app-container {
  padding: 20px 10px 0 10px;
}
</style>