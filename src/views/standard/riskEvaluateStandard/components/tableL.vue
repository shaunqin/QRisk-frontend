<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @row-click="rowClick"
    >
      <el-table-column :label="$t('standard.probablyLevel')">
        <el-table-column prop="riskLevel" :label="$t('standard.level')" width="120">
          <template slot-scope="{row}">{{row.riskLevel}}级</template>
        </el-table-column>
        <el-table-column prop="standard" :label="$t('standard.definingStandard')" />
        <el-table-column prop="score" :label="$t('standard.quantitativeScore')" width="120" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  props: {
    deptPath: {
      type: String,
      default: ""
    }
  },
  created() {
    this.init();
  },
  watch: {
    deptPath(val) {
      this.init();
    }
  },
  methods: {
    beforeInit() {
      this.url = `/info_mgr/riskLevel_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { deptPath: this.deptPath || "000003", type: 2 };
      return true;
    },
    rowClick(row) {
      let index = row.riskLevel;
      this.$emit("setIndex", index);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>