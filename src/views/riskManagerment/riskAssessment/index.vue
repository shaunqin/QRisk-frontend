<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="3">
        <div class="next-menu">
          <router-link
            :to="'/riskManagerment/page/riskAssessment?type='+item.type"
            class="next-menu-item pan-btn blue-btn"
            v-for="item in options"
            :key="item.name"
            :class="item.type==assessmentType?'active':''"
          >{{item.name}}</router-link>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="head-container">
          <el-button size="mini" type="success" icon="el-icon-plus" @click="add">新建通知</el-button>
          <el-button size="mini" type="success" icon="el-icon-plus" @click="addAssessment">新建评估</el-button>
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
          <el-table-column prop="aa" label="风险" />
          <el-table-column prop="bb" label="标题" width="300" />
          <el-table-column prop="dd" label="发布时间" />
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" @click="hairdown(scope.row)">查看</el-button>
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
      </el-col>
    </el-row>
    <eform ref="form" :is-add="isAdd"></eform>
    <assessment ref="assessment"></assessment>

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
import assessment from "./formAssessment";
import hairdown from "./components/hairdown";
import approval from "./components/approval";
import feedback from "./components/feedback";
import check from "./components/check";
export default {
  components: {
    eform,
    hairdown,
    approval,
    feedback,
    fillinDialog,
    check,
    assessment,
  },
  mixins: [initData],
  data() {
    return {
      selections: [],
      type: "",
      options: [
        { name: "流程/标准", type: 1 },
        { name: "变革管理", type: 2 },
        { name: "维修能力", type: 3 },
        { name: "航站审定", type: 4 },
        { name: "其他评估", type: 5 },
      ],
      assessmentType: "",
    };
  },
  watch: {
    $route(route) {
      this.assessmentType = route.query.type;
    },
    assessmentType(val){
      this.$message(val)
    }
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "安全风险",
        bb: "飞机在运行过程中出现大翼引气渗漏等重复性故障",
        jj: "FP202005050" + i,
        cc: "admin",
        dd: "2020-04-22",
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
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    addAssessment() {
      this.$refs.assessment.dialog = true;
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
        jj: "FP2020050501",
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
        jj: "FP2020050501",
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
        jj: "FP2020050501",
      };
      _this.riskForm = {
        aa: "出现大翼引气渗漏等",
        bb:
          "A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息",
        cc: "出现相同的故障信息，并造成飞机返航",
        dd: "高",
        ee: "高",
        ff: "3",
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
        jj: "FP2020050501",
      };
      _this.riskForm = {
        aa: "出现大翼引气渗漏等",
        bb:
          "A321/B-1833 飞机执行 CA1948 航班，成都起飞后地面监控出现 AIR R WING LEAK 警告信息",
        cc: "出现相同的故障信息，并造成飞机返航",
        dd: "高",
        ee: "高",
        ff: "3",
      };
      _this.dialog = true;
    },
  },
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
.next-menu {
  min-height: calc(100vh - 90px);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 0;
  .next-menu-item {
    padding: 10px 10px;
    text-align: left;
    margin-bottom: 10px;
    display: block;
    &.active {
      background: #324157;
      color: #fff;
    }
  }
}
.blue-btn {
  background: transparent;
  color: #000;
  border-radius: 0;
  // &:hover::before, &:hover:after{
  //   background: #0062ff;
  // }
}
</style>