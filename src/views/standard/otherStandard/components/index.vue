<template>
  <div class="dataSource">
    <el-row :gutter="16">
      <el-col :span="12">
        <table-l></table-l>
      </el-col>
      <el-col :span="12">
        <table-r></table-r>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { riskOtherStandard } from "@/dataSource";
import tableL from "./tableL";
import tableR from "./tableR";
import charts from "@/components/Charts";
export default {
  components: { tableL, tableR, charts },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: "",
    };
  },
  mounted() {
    this.loading = false;
    this.data = riskOtherStandard;
  },
  methods: {
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
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