<template>
  <div class="orher-standard">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="standardNo" label="编号" />
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="创建时间">
        <template slot-scope="{row}">{{format(row.createTime)}}</template>
      </el-table-column>
      <el-table-column label="预览" width="100">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-view" @click="preview(row)"></el-button>
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
import { format } from "@/utils/datetime";
export default {
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    format,
    beforeInit() {
      this.url = `/info_mgr/other_standard_mgr/query/pageList/${this.page}/${this.size}`;
      return true;
    },
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
    },
    preview(row) {},
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