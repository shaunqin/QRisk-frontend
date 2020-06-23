<template>
  <div class="app-container">
    <div class="head-container">
      <el-form :model="form" label-width="auto" size="mini" inline>
        <el-form-item label="名称">
          <el-input v-model="form.aa" placeholder=""></el-input>
        </el-form-item>
         <el-form-item label="日期">
           <el-date-picker v-model="form.bb" placeholder=""></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success">搜索</el-button>
        </el-form-item>
      </el-form>
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
      <el-table-column label="操作" width="100px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)">详情</el-button>
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
    <detail ref="detail" :type="dialogType"></detail>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import detail from "./components/detail";
export default {
  components: { eform, detail },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      dialogType: "",
      form:{aa:"",bb:""}
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
    detail(row) {
      let _this = this.$refs.detail;
      _this.form = {
        aa:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        bb: "FP2020050501",
        cc: "批准",
        dd: "上海",
        ee: "2020-06-06",
        ff: "上海",
        gg: "杭州",
        hh: `2020 年 6 月 5 日，A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息，飞机返航，该机 5月 3 日曾出现相同的故障信息，并造成飞机返航`,
        jj: "FP2020050501"
      };
      _this.riskForm = {
        aa: "出现大翼引气渗漏等",
        bb:
          "A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息",
        cc: "出现相同的故障信息，并造成飞机返航",
        dd: "高",
        ee: "高",
        ff: "3"
      };
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