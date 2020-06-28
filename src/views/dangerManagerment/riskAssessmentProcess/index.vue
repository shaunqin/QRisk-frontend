<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="jj" label="编号" />
      <el-table-column prop="aa" label="风险"  />
      <el-table-column prop="bb" label="通知内容" width="300" />
      <el-table-column prop="cc" label="创建人" />
      <el-table-column prop="dd" label="创建时间" />
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="hairdown(scope.row)">下发</el-button>
            <el-button size="mini" @click="fillin(scope.row)">填报</el-button>
            <el-button size="mini" @click="approval(scope.row)">审批</el-button>
            <el-button size="mini" @click="feedback(scope.row)">反馈</el-button>
            <el-button size="mini" @click="check(scope.row)">验证</el-button>
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
    <!-- 下发 -->
    <hairdown ref="hairdown" :type="type"></hairdown>
    <!-- 填报 -->
    <fillin-dialog ref="fillinDialog"></fillin-dialog>
    <!-- 审批 -->
    <approval ref="approval"></approval>
    <!-- 反馈 -->
    <feedback ref="feedback"></feedback>
    <!-- 验证 -->
    <check ref="check"></check>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import fillinDialog from "./components/fillinDialog";
import eform from "./form";
import hairdown from "./components/hairdown";
import approval from "./components/approval";
import feedback from "./components/feedback";
import check from "./components/check";
export default {
  components: { eform, hairdown, approval, feedback, fillinDialog,check },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      type: ""
    };
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "安全风险",
        bb:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        jj: "FP202005050" + i,
        cc:"admin",dd:"2020-04-22"
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
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      console.log(row);
    },
    hairdown(row) {
      this.type = "下发";
      let _this = this.$refs.hairdown;
      // _this.form = {
      //   aa: "FP2020050500",
      //   bb: "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存",
      //   cc: "大",
      //   dd: "出现大翼引气渗漏等",
      //   ee: "3",
      //   ff: "该机 5月 3 日曾出现相同的故障信息，并造成飞机返航",
      //   gg:"出现相同的故障信息，并造成飞机返航",hh:"上海",ii:"在控",jj:"20200101"
      // };
      _this.dialog = true;
    },
    fillin(row) {
      this.type = "填报";
      let _this = this.$refs.fillinDialog;
      _this.form = {
        aa:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        bb: "上海",
        cc: "admin",
        dd: "是",
        ee: "2020-06-06",
        jj: "FP2020050501"
      };
      _this.dialog = true;
    },
    approval(row) {
      let _this = this.$refs.approval;
      _this.form = {
        aa:
          "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降、中断起飞的安全风险。",
        bb: "上海",
        cc: "admin",
        dd: "是",
        ee: "2020-06-06",
        jj: "FP2020050501"
      };
      _this.dialog = true;
    },
    feedback(row) {
      let _this = this.$refs.feedback;
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
    check(row) {
      let _this = this.$refs.check;
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