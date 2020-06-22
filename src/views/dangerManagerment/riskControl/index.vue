<template>
  <div class="app-container">
    <div class="head-container">
      <el-button type="success" size="mini" @click="riskControl">生成在控风险</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="编号" />
      <el-table-column prop="bb" label="名称" />
      <el-table-column prop="cc" label="备注" />
      <el-table-column label="操作" width="230px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="hairdown(scope.row)">下发</el-button>
            <el-button size="mini" @click="approval(scope.row)">审批</el-button>
            <el-button size="mini" @click="feedback(scope.row)">反馈</el-button>
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
    <risk-control ref="riskControl" :type="dialogType"></risk-control>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import riskControl from "./components/index";
export default {
  components: { eform, riskControl },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      dialogType: ""
    };
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "FP202005050"+i,
        bb: "飞机在运行过程中出现大翼引气渗漏等重复性故障",
        cc: "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        dd: "测试",
        ee: "测试",
        ff: "测试",
        gg: "测试",
        hh: "测试",
        ii: "测试",
        jj: "测试"
      });
    }
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    riskControl() {
      this.dialogType = "";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    hairdown(row) {
      this.dialogType = "下发";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    approval(row) {
      this.dialogType = "审批";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    feedback(row) {
      this.dialogType = "反馈";
      let _this = this.$refs.riskControl;
      _this.dialog = true;
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