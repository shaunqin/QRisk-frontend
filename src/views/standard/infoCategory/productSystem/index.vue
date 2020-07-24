<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      border
      :span-method="objectSpanMethod"
    >
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column prop="product" label="所属产品" width="150" />
      <el-table-column prop="system" label="系统名称" width="150" />
      <el-table-column prop="diskSystemDesc" label="备注" show-overflow-tooltip />
    </el-table>
    <!--分页组件-->
    <!-- <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    /> -->
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      
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
          if (val[index].product === val[index - 1].product) {
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
      this.url = `/info_mgr/prod_mgr/query/all`;
      return true;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
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
