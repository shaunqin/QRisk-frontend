<template>
  <div class="dataSource">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      :span-method="objectSpanMethod"
      border
    >
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column prop="category1" :label="$t('standard.hazardLevel1')" width="150" />
      <el-table-column prop="cateValue" :label="$t('standard.no')" width="100" />
      <el-table-column prop="category2" :label="$t('standard.hazardLevel2')" width="150" />
      <el-table-column prop="diskNo" :label="$t('standard.no')" width="100" />
      <el-table-column :label="$t('standard.hazard')">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.diskDesc" placement="left">
            <span v-text="scope.row.diskName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {};
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
          if (val[index].category1 === val[index - 1].category1) {
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
      this.url = `/info_mgr/hazard_mgr/query/list`;
      return true;
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
