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
      <el-table-column prop="taskName" label="名称" />
      <el-table-column prop="year" label="年度" />
      <el-table-column prop="productName" label="产品" />
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
import eform from "./form";
import { queryYearTaskDetail } from '@/api/quality'
export default {
  components: { eform },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/task_mgr/query/yearTask/pageList/${this.page}/${this.size}`;
      this.params = { type: 2 };
      return true;
    },
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
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      queryYearTaskDetail(row.yearTaskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          _this.form = res.obj;
          _this.dialog = true;
        }
      })

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
    hairdown(row) {
      let _this = this.$refs.hairdownDialog;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    approval(row) {
      let _this = this.$refs.approvalDialog;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
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
.head-container {
  margin-bottom: 20px;
}
</style>