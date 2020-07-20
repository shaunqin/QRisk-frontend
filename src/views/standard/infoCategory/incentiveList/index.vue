<template>
  <div class="dataSource">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column prop="cate" label="类别" width="200" />
      <el-table-column prop="diskName" label="诱因" />
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
export default {
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
   created() {
    this.init();
  },
  watch: {
    data(val) {
      this.spanArr = [];
      this.position = 0;
      val.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (val[index].cate === val[index - 1].cate) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    }
  },
  methods: {
     beforeInit() {
      this.url = `/info_mgr/incentive_mgr/query/pageList/${this.page}/${this.size}`;
      return true;
    },
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
