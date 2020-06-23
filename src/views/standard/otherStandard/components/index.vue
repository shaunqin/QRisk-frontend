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
      <el-table-column prop="aa" label="名称">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.aa}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="bb" label="创建时间" />
    </el-table>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: ""
    };
  },
  mounted() {
    this.loading = false;
    this.data = [
      { aa: "漏取销子/管套", bb: "2020-04-05" },
      { aa: "漏取销子/管套", bb: "2020-04-05" },
      { aa: "漏取销子/管套", bb: "2020-04-05" }
    ];
  },
  methods: {
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
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