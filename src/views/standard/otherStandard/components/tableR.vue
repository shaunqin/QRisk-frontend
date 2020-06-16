<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column label="公司风险可能性等级">
        <el-table-column prop="aa" label="严重性等级" width="100" />
        <el-table-column prop="bb" label="界定标准" />
        <el-table-column prop="cc" label="量化分值" width="100" />
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <!-- <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />-->
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  mounted() {
    this.loading = false;
    this.data = [
      { aa: "8级", bb: ">120次/年", cc: "200" },
      { aa: "7级", bb: "21~120次/年", cc: "80" },
      { aa: "6级", bb: "12~20次/年", cc: "30" },
      { aa: "5级", bb: "7~11次/年", cc: "20" },
      { aa: "4级", bb: "1~6次/年", cc: "10" }
    ];
  }
};
</script>

<style lang="scss" scoped>
</style>